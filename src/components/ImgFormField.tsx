"use client";

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/schema/image";
import {
  FileInput as FileInputArea,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  useFileUpload,
} from "./ui/file-upload";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import TrainingImg from "./TrainingImg";
import { FileUp } from "lucide-react";
import { Button } from "./ui/button";
import { useFormContext } from "react-hook-form";
import { isValidImage } from "@/lib/utils";
import { ImageProps } from "next/image";

export default function ImgFormField({ alt, ...props }: Partial<ImageProps>) {
  const form = useFormContext<{ img: string | File }>();

  return (
    <FormField
      control={form.control}
      name="img"
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel>Immagine</FormLabel>
          <FormControl>
            <FileUploader
              value={value instanceof File ? [value] : undefined}
              onValueChange={(files) => onChange(files?.[0])}
              dropzoneOptions={{ multiple: false, maxSize: MAX_FILE_SIZE }}
              className="relative space-y-1"
            >
              {value && (
                <FileUploaderContent>
                  <FileUploaderItem index={0}>
                    {value instanceof File && value.name}
                  </FileUploaderItem>
                  {(typeof value === "string" ||
                    isValidImage(value).isValid) && (
                    <TrainingImg
                      alt={alt}
                      {...props}
                      training={{ imageUrl: typeof value === "string" ? value : undefined }}
                    />
                  )}
                </FileUploaderContent>
              )}
              <FileInput />
            </FileUploader>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FileInput() {
  const { isLOF } = useFileUpload();

  return (
    !isLOF && (
      <FileInputArea
        className="border border-dashed border-slate-400 p-6
            flex flex-col items-center gap-2"
      >
        <>
          <FileUp size={50} />
          <p className="text-muted-foreground text-sm">
            Formati acettati:{" "}
            {ACCEPTED_FILE_TYPES.map((fileType) => fileType.split("/")[1]).join(
              ", "
            )}
          </p>

          <Button
            type="button"
            variant="outline"
            className="font-medium text-base mt-3"
          >
            Carica o Trascina file
          </Button>
        </>
      </FileInputArea>
    )
  );
}
