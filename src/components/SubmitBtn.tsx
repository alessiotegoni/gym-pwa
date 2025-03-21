"use client";

import { useFormContext } from "react-hook-form";
import { Button, ButtonProps } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { ReactNode } from "react";

type Props = {
  label?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  children?: ReactNode;
} & ButtonProps;

export default function SubmitBtn({
  label,
  loadingLabel,
  className,
  disabled,
  isLoading,
  type = "submit",
  children,
  ...props
}: Props) {
  const form = useFormContext();
  const { pending } = useFormStatus();

  const isPending =
    isLoading !== undefined
      ? isLoading
      : form?.formState?.isSubmitting || pending;

  return (
    <Button
      type={type}
      disabled={isPending || disabled}
      className={cn("w-full", className)}
      {...props}
    >
      {isPending ? (
        <>
          <LoaderCircle className="animate-spin !size-5" />
          {loadingLabel && `${loadingLabel}...`}
        </>
      ) : (
        <>
          {children}
          {label}
        </>
      )}
    </Button>
  );
}
