import express from 'express';
import { requireAuth, requireVendor } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createSubmission,
  deleteMySubmission,
  getMySubmission,
  listMySubmissions,
  updateMySubmission,
} from '../controllers/vendorSubmissionController.js';
import {
  createSubmissionSchema,
  updateSubmissionSchema,
} from '../validators/submissionValidators.js';

const router = express.Router();

router.use(requireAuth, requireVendor);

router.post('/', validate(createSubmissionSchema), createSubmission);
router.get('/', listMySubmissions);
router.get('/:id', getMySubmission);
router.put('/:id', validate(updateSubmissionSchema), updateMySubmission);
router.delete('/:id', deleteMySubmission);

export default router;
