import { Router } from 'express';
import upload from '../utils/multer';
import { registerUser, loginUser } from '../controllers/auth.controllers';

const authRouter = Router();

authRouter.post('/register', upload.single('image'), registerUser);
authRouter.post('/login', loginUser);

export default authRouter;
