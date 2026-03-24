import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a data URL or a remote URL to Cloudinary.
 * Uses "limit" crop so the original aspect ratio is fully preserved —
 * the image is only downscaled if it exceeds 1200px on either side.
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
        width: 1200,
        height: 1200,
        crop: "limit",      // never crops; shrinks only if larger than 1200×1200
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
  return result.secure_url;
}
