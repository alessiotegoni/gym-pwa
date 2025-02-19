"use client";

import { DailyTraining, DailyTrainingSchemaType } from "@/types";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function TrainingImg({
  id,
  imageUrl,
  description,
}: Partial<DailyTraining>) {
  const form = useFormContext<DailyTrainingSchemaType>();

  const imageFile = form?.watch("img");

  imageUrl = useMemo(
    () =>
      imageFile instanceof File ? URL.createObjectURL(imageFile) : imageUrl,
    [imageFile]
  );

  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(imageUrl!);
    };
  }, [imageFile]);

  const alt = description || `allenamento ${id}`;

  return (
    imageUrl && (
      <Image
        src={imageUrl}
        alt={alt}
        width={300}
        height={400}
        priority={true}
        className="rounded-lg w-full object-cover aspect-video"
      />
    )
  );
}
