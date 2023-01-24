const router = require('express').Router()
const upload = require('../utils/multer')


const {
    registerUser,
    loginUser
} = require('../controllers/AuthControllers')


router.post('/register', upload.single('image'), registerUser)
router.post('/login', loginUser)



module.exports = router

export {}