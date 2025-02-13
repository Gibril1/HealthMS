import { Router } from 'express';
import upload from '../utils/multer';
import { registerUser, loginUser } from '../controllers/auth.controllers';

const router = Router();

router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);

export default router;
// const upload = require('../utils/multer')


// const {
//     registerUser,
//     loginUser
// } = require('../controllers/AuthControllers')


// router.post('/register', upload.single('image'), registerUser)
// router.post('/login', loginUser)



// module.exports = router

// export {}