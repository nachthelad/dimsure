import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"
import imageCompression from "browser-image-compression";

// Optimiza y sube imagen para productos o blog
export const optimizeAndUploadImage = async (file: File, folder: string = "products", prefix: string = ""): Promise<string> => {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    };
    const compressedFile = await imageCompression(file, options);
    const timestamp = Date.now();
    const fileName = `${prefix ? prefix + "_" : ""}${timestamp}_${compressedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const imageRef = ref(storage, `${folder}/${fileName}`);
    const snapshot = await uploadBytes(imageRef, compressedFile);
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
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error("Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

// Validate image file
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Image size must be less than 5MB",
    }
  }

  return { isValid: true }
}

