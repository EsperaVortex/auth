const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/uploadMiddleware')
const { uploadImage, fetchImage, deleteImage } = require('../controllers/imageController')
//upload the image
router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage)

//get the image
router.get('/get', authMiddleware, fetchImage)


//delete image
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImage)
module.exports = router