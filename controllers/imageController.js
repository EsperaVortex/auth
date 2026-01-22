const Image = require('../models/ImageModel')
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const uploadImage = async (req, res) => {
    try {

        //check if file is missing
        if (!req.file) {
            res.status(400).json({
                sucess: false,
                message: 'No File Provided. Please attach the file/image'
            })
        }
        //the uploadtocloudinary returns url and publicid
        const { url, publicId } = await uploadToCloudinary(req.file.path)


        //store the image url and public id along with the uploaded user id
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newlyUploadedImage.save();
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            message: 'Image Uploaded Successfully',
            image: newlyUploadedImage
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            sucess: false,
            message: 'Failed to upload Image'
        })
    }
}



const fetchImage = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 2;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const totalImage = await Image.countDocuments();
        const totalPages = Math.ceil(totalImage / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if (images) {
            res.status(200).json({
                sucess: true,
                message: 'Successfully found images',
                currentPages: page,
                totalPages: totalPages,
                totalImages: totalImage,
                data: images
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: 'Failed to load image. Please try again'
        })
    }
}


const deleteImage = async (req, res) => {
    try {
        const getIdImgDelete = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getIdImgDelete);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image Not Found!"
            })
        }

        //check if the user Uploaded the image or not
        if (image.uploadedBy.toString() !== userId) {
            return res.status(404).json({
                success: false,
                message: "Not Uploaded By You"
            })
        }
        //delete from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        //delete from mongodb
        await Image.findByIdAndDelete(getIdImgDelete)

        //delete from local

        res.status(200).json({
            success: true,
            messsage: "Image Delete Successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
module.exports = {
    uploadImage,
    fetchImage,
    deleteImage
}