import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * function to upload file on cloudinary
 * @param {*} localFilePath
 * @returns
 */
const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return { avatar: response.url, avatarId: response.public_id };
  } catch (error) {
    console.log("Cloudinary Image Uploading Error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

/**
 * function to delete file from cloudinary
 * @param {*} fileId
 * @returns
 */
const deleteFromCloudinary = async (avatarId) => {
  try {
    if (!avatarId) return;
    await cloudinary.uploader.destroy(avatarId);
  } catch (error) {
    console.log("Cloudinary Image Deleting Error:", error);
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
