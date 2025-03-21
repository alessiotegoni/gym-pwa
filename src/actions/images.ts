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

/**
 * Ridimensiona e comprime un'immagine prima dell'upload
 * Da usare sul client prima di inviare l'immagine al server
 */
export const prepareImageForUpload = async (
  file: File,
  maxWidth = 1200,
  maxQuality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      if (file.size < 500 * 1024) {
        return resolve(file);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Impossibile processare l'immagine"));
                return;
              }

              const optimizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(optimizedFile);
            },
            "image/jpeg",
            maxQuality
          );
        };

        img.onerror = () =>
          reject(new Error("Impossibile caricare l'immagine"));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error("Impossibile leggere il file"));
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};
