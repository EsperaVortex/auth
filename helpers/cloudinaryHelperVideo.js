const cloudinary = require('../config/cloudinary')


const uploadVideoToCloudinary = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            resource_type: "video"
        })

        return {
            url: result.secure_url,
            publicId: result.public_id
        };

    } catch (err) {
        console.log("Failed to upload", err)
        throw new Error('Failed to upload')
    }

}


module.exports = { uploadVideoToCloudinary }