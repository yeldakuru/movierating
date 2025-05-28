import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud name from Cloudinary
    api_key: process.env.CLOUDINARY_API_KEY, // API key from Cloudinary
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret from Cloudinary  
}); // API secret from Cloudinary

export default cloudinary; // Export the configured Cloudinary instance