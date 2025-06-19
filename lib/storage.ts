import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

// Upload image to Firebase Storage
export const uploadProductImage = async (file: File, productSku: string): Promise<string> => {
  try {
    console.log("🔄 Uploading image for product:", productSku)

    // Create a reference to the file location
    const timestamp = Date.now()
    const fileName = `${productSku}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const imageRef = ref(storage, `products/${fileName}`)

    // Upload the file
    const snapshot = await uploadBytes(imageRef, file)
    console.log("✅ Image uploaded successfully")

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log("✅ Download URL obtained:", downloadURL)

    return downloadURL
  } catch (error) {
    console.error("❌ Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

// Delete image from Firebase Storage
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
    console.log("✅ Image deleted successfully")
  } catch (error) {
    console.error("❌ Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

// Upload multiple images
export const uploadMultipleImages = async (files: File[], productSku: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadProductImage(file, productSku))
    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error("❌ Error uploading multiple images:", error)
    throw new Error("Failed to upload images")
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
