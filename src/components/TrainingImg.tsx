"use client";

import { DailyTraining, DailyTrainingSchemaType } from "@/types";
import Image, { ImageProps } from "next/image";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  training: Partial<DailyTraining>;
} & Partial<ImageProps>;

export default function TrainingImg({ training, alt, ...props }: Props) {
  const form = useFormContext<DailyTrainingSchemaType>();

  const imageFile = form?.watch("img");
  let imageUrl = training.imageUrl;

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

  return (
    imageUrl && (
      <Image
        alt={alt || (imageFile as File).name}
        width={300}
        height={400}
        priority={true}
        className="rounded-lg w-full object-cover aspect-video"
        {...props}
        src={imageUrl}
      />
    )
  );
}
