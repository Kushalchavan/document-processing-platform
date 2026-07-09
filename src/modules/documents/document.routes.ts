import { Router } from 'express';
import { authenticate } from '@shared/middleware/auth.middleware';
import { upload } from '@config/multer';
import { uploadDocumentController, getDocumentsController, getDocumentByIdController } from './document.controller';

const router = Router();

router.post('/upload',authenticate,upload.single('document'),uploadDocumentController);
router.get('/',authenticate,getDocumentsController);
router.get( '/:id',authenticate,getDocumentByIdController,);

export default router;
