import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a data URL or a remote URL to Cloudinary.
 * Images are resized to 800×600 (fill crop) with auto quality and format.
 * Returns the HTTPS secure URL.
 */
export async function uploadBusinessImage(
  source: string,
  publicId: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(source, {
    folder: "food-rescue/businesses",
    public_id: publicId,
    overwrite: true,
    transformation: [
      {
        width: 800,
        height: 600,
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
  return result.secure_url;
}
