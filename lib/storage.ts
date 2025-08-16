import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";
import imageCompression from "browser-image-compression";

// Optimiza y sube imagen para productos o blog
export const optimizeAndUploadImage = async (
  file: File,
  folder: string = "products",
  prefix: string = ""
): Promise<string> => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    };
    const compressedFile = await imageCompression(file, options);
    const timestamp = Date.now();
    const fileName = `${
      prefix ? prefix + "_" : ""
    }${timestamp}_${compressedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const imageRef = ref(storage, `${folder}/${fileName}`);
    // Set strong cache headers and proper content type on upload
    const snapshot = await uploadBytes(imageRef, compressedFile, {
      contentType: compressedFile.type || "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
    });
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Delete image from Firebase Storage
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};

// Image file validation
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Please upload JPG, PNG, or WebP images only.",
    };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File too large. Please upload images smaller than 5MB.",
    };
  }

  return { isValid: true };
};
