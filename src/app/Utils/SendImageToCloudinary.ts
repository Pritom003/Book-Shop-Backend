import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import config from '../config';

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// ✅ Function to Upload Image to Cloudinary
export const sendImageToCloudinary = (imageName: string, filePath: string): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return reject(new Error("File not found before upload"));
    }

    cloudinary.uploader.upload(
      filePath,
      { public_id: imageName.trim() },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url) {
          return reject(new Error('Failed to upload image to Cloudinary'));
        }

        resolve({ secure_url: result.secure_url });

        // ✅ Ensure file exists before deleting
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`File deleted successfully: ${filePath}`);
          } catch (err) {
            console.error(`Error deleting file: ${err}`);
          }
        } else {
          console.log(`File not found for deletion: ${filePath}`);
        }
      }
    );
  });
};


// ✅ Ensure the 'Uploads' directory exists
const uploadDir = path.join(process.cwd(), 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Uploads directory created: ${uploadDir}`);
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ Multer Middleware Export
export const upload = multer({ storage: storage });
