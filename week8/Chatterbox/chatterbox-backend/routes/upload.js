// routes/upload.js
const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const jwtAuth = require('../middleware/jwtAuth');

// Configure multer with file size limits and file type validation
const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Define allowed file types
        const allowedTypes = [
            // Images
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
            // Videos
            'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm',
            // Documents
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'text/plain', // .txt
            'application/zip',
            'application/x-rar-compressed',
            'application/x-zip-compressed',
            'application/octet-stream' // Generic binary
        ];
        
        // Also check file extensions for additional safety
        const allowedExtensions = [
            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg',
            '.mp4', '.avi', '.mov', '.mkv', '.webm',
            '.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'
        ];
        
        const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();
        
        if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype} (${fileExtension})`));
        }
    }
});

const router = express.Router();

router.post('/', jwtAuth, (req, res) => {
    upload.single('file')(req, res, async (err) => {
        try {
            // Handle multer errors
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
                }
                return res.status(400).json({ message: `Upload error: ${err.message}` });
            } else if (err) {
                console.error('Upload error:', err);
                return res.status(400).json({ message: err.message });
            }
            
            console.log('File upload request received:', req.file);
            
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            console.log('✅ Upload details:');
            console.log('- Original name:', req.file.originalname);
            console.log('- MIME type:', req.file.mimetype);
            console.log('- Size:', req.file.size, 'bytes');
            console.log('- Cloudinary URL:', req.file.path);
            console.log('- Resource type:', req.file.type);
            
            // Return the file information with proper extension handling
            const originalExtension = req.file.originalname.split('.').pop().toLowerCase();
            const fileUrl = req.file.path;
            
            // For raw files (especially PDFs), ensure proper delivery
            let finalUrl = fileUrl;
            if (req.file.resource_type === 'raw') {
                // For PDFs and other documents, use the raw URL with proper headers
                if (originalExtension === 'pdf') {
                    // Ensure PDF is served with correct content-type
                    finalUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
                } else {
                    // For other raw files, force download with original filename
                    finalUrl = `${fileUrl}?dl=${encodeURIComponent(req.file.originalname)}`;
                }
            }
            
            res.json({
                url: finalUrl,
                type: req.file.mimetype,
                filename: req.file.originalname,
                size: req.file.size,
                resourceType: req.file.resource_type || 'raw',
                extension: originalExtension
            });
            
        } catch (error) {
            console.error('❌ Upload failed:');
            console.error('Error details:', error);
            
            // More detailed error logging
            if (error.http_code) {
                console.error('Cloudinary HTTP Code:', error.http_code);
            }
            if (error.message) {
                console.error('Error message:', error.message);
            }
            
            res.status(500).json({
                message: 'Upload failed',
                error: error.message || 'Unknown error',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    });
});

module.exports = router;