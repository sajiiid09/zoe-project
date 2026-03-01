import prisma from '../config/db.js';
import { submissionRepository } from '../repositories/submissionRepository.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/errors.js';
import { ensureNonNegativeInteger, ensurePositiveAmount } from '../utils/money.js';

const mapSubmission = (submission) => ({
  ...submission,
  vendorQuotedPrice: Number(submission.vendorQuotedPrice),
  suggestedRetailPrice:
    submission.suggestedRetailPrice === null || submission.suggestedRetailPrice === undefined
      ? null
      : Number(submission.suggestedRetailPrice),
});

export class VendorSubmissionService {
  constructor(repository = submissionRepository) {
    this.repository = repository;
  }

  async create(user, payload) {
    const store = await prisma.store.findUnique({
      where: { ownerId: user.id },
    });

    if (!store) {
      throw new NotFoundError('You must create a vendor profile before submitting products');
    }

    if (store.approvalStatus !== 'APPROVED') {
      throw new ForbiddenError('Your vendor profile must be approved before creating submissions');
    }

    const created = await this.repository.create({
      vendorId: user.id,
      storeId: store.id,
      title: payload.title,
      description: payload.description || null,
      category: payload.category || null,
      vendorQuotedPrice: ensurePositiveAmount(payload.vendorQuotedPrice, 'vendorQuotedPrice'),
      suggestedRetailPrice:
        payload.suggestedRetailPrice !== undefined && payload.suggestedRetailPrice !== null
          ? ensurePositiveAmount(payload.suggestedRetailPrice, 'suggestedRetailPrice')
          : null,
      currency: payload.currency || 'usd',
      stockAvailable: ensureNonNegativeInteger(payload.stockAvailable ?? 0, 'stockAvailable'),
      images: payload.images || [],
      status: 'SUBMITTED',
      submittedAt: new Date(),
    });

    return mapSubmission(created);
  }

  async listForVendor(user) {
    const submissions = await this.repository.listForVendor(user.id);
    return submissions.map(mapSubmission);
  }

  async getForVendor(user, id) {
    const submission = await this.repository.findById(id);

    if (!submission || submission.vendorId !== user.id) {
      throw new NotFoundError('Submission not found');
    }

    return mapSubmission(submission);
  }

  async updateForVendor(user, id, payload) {
    const submission = await this.repository.findById(id);

    if (!submission || submission.vendorId !== user.id) {
      throw new NotFoundError('Submission not found');
    }

    if (!['DRAFT', 'SUBMITTED'].includes(submission.status)) {
      throw new ForbiddenError('Only draft or submitted records can be updated');
    }

    const updated = await this.repository.update(id, {
      title: payload.title ?? submission.title,
      description: payload.description ?? submission.description,
      category: payload.category ?? submission.category,
      vendorQuotedPrice:
        payload.vendorQuotedPrice !== undefined
          ? ensurePositiveAmount(payload.vendorQuotedPrice, 'vendorQuotedPrice')
          : submission.vendorQuotedPrice,
      suggestedRetailPrice:
        payload.suggestedRetailPrice !== undefined
          ? payload.suggestedRetailPrice === null
            ? null
            : ensurePositiveAmount(payload.suggestedRetailPrice, 'suggestedRetailPrice')
          : submission.suggestedRetailPrice,
      stockAvailable:
        payload.stockAvailable !== undefined
          ? ensureNonNegativeInteger(payload.stockAvailable, 'stockAvailable')
          : submission.stockAvailable,
      images: payload.images ?? submission.images,
    });

    return mapSubmission(updated);
  }

  async deleteForVendor(user, id) {
    const submission = await this.repository.findById(id);

    if (!submission || submission.vendorId !== user.id) {
      throw new NotFoundError('Submission not found');
    }

    if (!['DRAFT', 'SUBMITTED'].includes(submission.status)) {
      throw new ForbiddenError('Only draft or submitted records can be deleted');
    }

    await this.repository.delete(id);

    return { deleted: true };
  }
}

export const vendorSubmissionService = new VendorSubmissionService();
