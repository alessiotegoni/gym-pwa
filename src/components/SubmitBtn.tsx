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
  isLoading,
  type = "submit",
  children,
  ...props
}: Props) {
  const form = useFormContext();
  const { pending } = useFormStatus();

  const isPending = form?.formState?.isSubmitting || pending || isLoading;

  return (
    <Button
      type={type}
      disabled={isPending}
      className={cn("w-full", className)}
      {...props}
    >
      {isPending ? (
        <>
          <LoaderCircle className="animate-spin !size-4" />
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
Button;
