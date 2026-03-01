import express from 'express';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  acceptAdminSubmission,
  getAdminSubmission,
  listAdminSubmissions,
  rejectAdminSubmission,
} from '../controllers/adminSubmissionController.js';
import {
  acceptSubmissionSchema,
  rejectSubmissionSchema,
} from '../validators/submissionValidators.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', listAdminSubmissions);
router.get('/:id', getAdminSubmission);
router.put('/:id/accept', validate(acceptSubmissionSchema), acceptAdminSubmission);
router.put('/:id/reject', validate(rejectSubmissionSchema), rejectAdminSubmission);

export default router;
