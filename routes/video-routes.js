const express = require('express')
const router = express.Router();


const { uploadVideo, fetchVideo } = require('../controllers/videoController')
const videoMiddleware = require('../middleware/uploadVideoMiddleware');
const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middleware');

//upload video

router.post('/uploadVideo', authMiddleware, isAdminUser, videoMiddleware.single('video'), uploadVideo);

//fetch video
router.get('/getVideo', authMiddleware, fetchVideo);

module.exports = router