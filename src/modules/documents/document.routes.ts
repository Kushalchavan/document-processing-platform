import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { upload } from '../../config/multer.js';
import {
  uploadDocumentController,
  getDocumentsController,
  getDocumentByIdController,
  deleteDocumentController,
} from './document.controller.js';

const router = Router();

router.post('/upload', authenticate, upload.single('document'), uploadDocumentController);
router.get('/', authenticate, getDocumentsController);
router.get('/:id', authenticate, getDocumentByIdController);
router.delete('/:id', authenticate, deleteDocumentController);

export default router;
