import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000  // 60 seconds
});

// Function to upload a file with options, typed to return a Promise<UploadApiResponse>
const uploadFileToCloudinary = async (filePath: string, options: UploadApiOptions): Promise<UploadApiResponse> => {
  return cloudinary.uploader.upload(filePath, options);
};

export { cloudinary, uploadFileToCloudinary };
