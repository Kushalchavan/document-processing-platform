import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { ValidationError } from '@shared/errors/ValidationError';

const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const userId = req.user.userId;

    // Create a directory for the user if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', `user-${userId}`);

    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },

  // Generate a unique filename for the uploaded file
  filename(_req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Configure multer with the storage and file size limit
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter(_req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new ValidationError('Only PDF, DOC, DOCX and TXT files are allowed'));
    }

    cb(null, true);
  },
});
