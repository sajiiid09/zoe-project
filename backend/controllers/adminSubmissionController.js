import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/authMiddleware.js';
import { adminSubmissionService } from '../services/adminSubmissionService.js';

export const listAdminSubmissions = asyncHandler(async (req, res) => {
  const submissions = await adminSubmissionService.listSubmissions();
  return sendSuccess(res, submissions);
});

export const getAdminSubmission = asyncHandler(async (req, res) => {
  const submission = await adminSubmissionService.getSubmission(req.params.id);
  return sendSuccess(res, submission);
});

export const acceptAdminSubmission = asyncHandler(async (req, res) => {
  const result = await adminSubmissionService.acceptSubmission(req.user, req.params.id, req.body);
  return sendSuccess(res, result, 'Submission accepted and catalog product created');
});

export const rejectAdminSubmission = asyncHandler(async (req, res) => {
  const submission = await adminSubmissionService.rejectSubmission(req.user, req.params.id, req.body.reason);
  return sendSuccess(res, submission, 'Submission rejected successfully');
});
