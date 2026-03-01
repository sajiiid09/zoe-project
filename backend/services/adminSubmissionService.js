import { submissionRepository } from '../repositories/submissionRepository.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { calculateMargin, ensureNonNegativeInteger, ensurePositiveAmount } from '../utils/money.js';

const mapCatalogProduct = (product) => ({
  ...product,
  retailPrice: Number(product.retailPrice),
});

const mapSubmission = (submission) => ({
  ...submission,
  vendorQuotedPrice: Number(submission.vendorQuotedPrice),
  suggestedRetailPrice:
    submission.suggestedRetailPrice === null || submission.suggestedRetailPrice === undefined
      ? null
      : Number(submission.suggestedRetailPrice),
});

export class AdminSubmissionService {
  constructor(submissionRepo = submissionRepository) {
    this.submissionRepo = submissionRepo;
  }

  async listSubmissions() {
    const submissions = await this.submissionRepo.listAll();
    return submissions.map(mapSubmission);
  }

  async getSubmission(id) {
    const submission = await this.submissionRepo.findById(id);

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    return mapSubmission(submission);
  }

  async acceptSubmission(adminUser, id, payload) {
    const submission = await this.submissionRepo.findById(id);

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    if (!['SUBMITTED', 'UNDER_REVIEW'].includes(submission.status)) {
      throw new ValidationError('Submission is not reviewable');
    }

    const retailPrice = ensurePositiveAmount(payload.retailPrice, 'retailPrice');
    const vendorQuotedPrice = Number(submission.vendorQuotedPrice);

    calculateMargin({
      retailUnitPrice: retailPrice,
      vendorPayoutUnitPrice: vendorQuotedPrice,
      affiliateCommissionUnit: 0,
    });

    const result = await this.submissionRepo.acceptSubmission({
      submissionId: id,
      reviewerId: adminUser.id,
      catalogProductData: {
        sourceSubmissionId: submission.id,
        supplierVendorId: submission.vendorId,
        title: payload.title || submission.title,
        description:
          payload.description !== undefined ? payload.description : submission.description,
        category: payload.category !== undefined ? payload.category : submission.category,
        retailPrice,
        currency: submission.currency,
        stock: payload.stock !== undefined
          ? ensureNonNegativeInteger(payload.stock, 'stock')
          : submission.stockAvailable,
        images: payload.images || submission.images || [],
        status: payload.status || 'ACTIVE',
        isFeatured: Boolean(payload.isFeatured),
        createdByAdminId: adminUser.id,
      },
      supplyAgreementData: {
        submissionId: submission.id,
        vendorId: submission.vendorId,
        agreedPayoutAmount: vendorQuotedPrice,
        currency: submission.currency,
        createdByAdminId: adminUser.id,
      },
    });

    return {
      submission: mapSubmission(result.submission),
      catalogProduct: mapCatalogProduct(result.catalogProduct),
      supplyAgreement: {
        ...result.supplyAgreement,
        agreedPayoutAmount: Number(result.supplyAgreement.agreedPayoutAmount),
      },
    };
  }

  async rejectSubmission(adminUser, id, reason) {
    const submission = await this.submissionRepo.findById(id);

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    if (!['SUBMITTED', 'UNDER_REVIEW'].includes(submission.status)) {
      throw new ValidationError('Submission is not reviewable');
    }

    const updated = await this.submissionRepo.update(id, {
      status: 'REJECTED',
      rejectionReason: reason || null,
      reviewedAt: new Date(),
      reviewedById: adminUser.id,
    });

    return mapSubmission(updated);
  }
}

export const adminSubmissionService = new AdminSubmissionService();
