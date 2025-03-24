"use server";

import { v2 as cloudinary, ImageTransformationOptions } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImg = async (
  file: File,
  options: {
    folder?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    isProfilePic?: boolean;
  } = {}
): Promise<string> => {
  try {
    const {
      folder = "uploads",
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 80,
      isProfilePic = false,
    } = options;

    const uniqueId = `${folder}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transformations: ImageTransformationOptions[] = [];

    if (isProfilePic) {
      transformations.push(
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto:good", fetch_format: "auto" }
      );
    } else {
      transformations.push(
        { width: maxWidth, height: maxHeight, crop: "limit" },
        { quality: quality, fetch_format: "auto" }
      );
    }

    const delivery = {
      quality: "auto",
      fetch_format: "auto",
      dpr: "auto",
      responsive: true,
    };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: uniqueId,
          resource_type: "auto",
          transformation: transformations,
          ...delivery,
        },
        (error, result) => {
          if (error) {
            console.error("Errore upload Cloudinary:", error);
            reject(new Error("Impossibile caricare l'immagine"));
          } else {
            console.log("Upload completato:", result?.secure_url);
            resolve(result?.secure_url || "");
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Errore durante preparazione upload:", error);
    throw new Error("Impossibile processare l'immagine");
  }
};
