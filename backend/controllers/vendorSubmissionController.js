import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/authMiddleware.js';
import { vendorSubmissionService } from '../services/vendorSubmissionService.js';

export const createSubmission = asyncHandler(async (req, res) => {
  const submission = await vendorSubmissionService.create(req.user, req.body);
  return sendSuccess(res, submission, 'Submission created successfully', 201);
});

export const listMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await vendorSubmissionService.listForVendor(req.user);
  return sendSuccess(res, submissions);
});

export const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await vendorSubmissionService.getForVendor(req.user, req.params.id);
  return sendSuccess(res, submission);
});

export const updateMySubmission = asyncHandler(async (req, res) => {
  const submission = await vendorSubmissionService.updateForVendor(req.user, req.params.id, req.body);
  return sendSuccess(res, submission, 'Submission updated successfully');
});

export const deleteMySubmission = asyncHandler(async (req, res) => {
  await vendorSubmissionService.deleteForVendor(req.user, req.params.id);
  return sendSuccess(res, null, 'Submission deleted successfully');
});
