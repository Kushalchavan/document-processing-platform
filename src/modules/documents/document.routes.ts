import { Router } from 'express';
import { authenticate } from '@shared/middleware/auth.middleware';
import { upload } from '@config/multer';
import { uploadDocumentController } from './document.controller';

const router = Router();

router.post('/upload',authenticate,upload.single('document'),uploadDocumentController);

export default router;