import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Multer config
const storage = multer.diskStorage({});

const fileFilter = (req: Request, file: any, cb: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
    cb(new Error('File type is not supported'), false);
    return;
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
