import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function uploadImageToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "shopeasy/products",
        transformation: [{ quality: "auto", fetch_format: "webp" }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Cloudinary upload failed: no secure_url returned"));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
