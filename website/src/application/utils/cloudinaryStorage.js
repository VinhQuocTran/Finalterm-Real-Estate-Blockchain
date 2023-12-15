const fs = require('fs');
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    uploadFile: async (file, { folder }) => {
        const response = await cloudinary.uploader.upload(file, { folder });

        fs.unlink(file);
        return response;
    },
    resizeImage: (id, h, w) => {
        return cloudinary.url(id, {
            height: h,
            width: w,
            crop: 'scale',
            format: 'jpg'
        });
    },
    removeFile: async (fileId) => {
        const response = await cloudinary.uploader.destroy(fileId);
        return response;
    }
};
