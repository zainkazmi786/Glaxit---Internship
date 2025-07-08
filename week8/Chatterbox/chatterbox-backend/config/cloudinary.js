//config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const mime = file.mimetype;
        const extension = file.originalname.split('.').pop().toLowerCase();
        const filename = file.originalname.split('.')[0];
        
        let resourceType = 'auto'; // Let Cloudinary auto-detect, but we'll override
        let allowedFormats = [];
        
        if (mime.startsWith('image/')) {
            resourceType = 'image';
            allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
        } else if (mime.startsWith('video/')) {
            resourceType = 'video';
            allowedFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        } else {
            // For documents and other files (including PDFs)
            resourceType = 'raw';
            // Don't restrict formats for raw files - let Cloudinary handle it
            allowedFormats = undefined;
        }
        
        const config = {
            folder: 'chatterbox_files',
            resource_type: resourceType,
            type: 'upload',
            access_mode: 'public',
            // Include the extension in the public_id for raw files
            public_id: `${Date.now()}_${filename}_${Math.random().toString(36).substr(2, 9)}.${extension}`,
            // Force the original filename to be preserved
            use_filename: true,
            unique_filename: false,
            // For raw files, ensure no processing/optimization
            flags: resourceType === 'raw' ? 'attachment' : undefined
        };
        
        // Only add allowed_formats if we have them (not for raw files)
        if (allowedFormats && allowedFormats.length > 0) {
            config.allowed_formats = allowedFormats;
        }
        
        return config;
    }
});

module.exports = { cloudinary, storage };   