const { uploadVideoToCloudinary } = require('../helpers/cloudinaryHelperVideo')
const Video = require('../models/videoModel')
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                sucess: false,
                message: 'Please upload the video'
            })
        }

        const { url, publicId } = await uploadVideoToCloudinary(req.file.path);

        const newlyUploadedVideo = new Video({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })


        await newlyUploadedVideo.save();

        res.status(200).json({
            success: true,
            message: 'Video Uploaded Successfully',
            video: newlyUploadedVideo
        })


    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to upload video", err
        })
    }
}


const fetchVideo = async (req, res) => {
    const videos = await Video.find({});

    if (videos) {
        res.status(200).json({
            success: true,
            message: "Successfully fetched Videos",
            data: videos
        })
    } else {
        res.status(404).json({
            success: false,
            message: "Failed to find Video"
        })
    }
}

module.exports = {
    uploadVideo,
    fetchVideo
}