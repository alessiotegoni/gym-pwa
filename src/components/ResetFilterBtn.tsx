"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props<T> = {
  input: T;
  paramName: string;
  className?: string;
  onReset?: () => void;
};

export default function ResetFilterBtn<T>({
  input,
  paramName,
  className,
  onReset,
}: Props<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleReset = () => {
    const form = document.querySelector<HTMLFormElement>(".search-user");

    if (form) form.reset();

    onReset?.();

    params.delete(paramName);
    router.replace(`?${params.toString()}`);
  };

  return (
    input && (
      <Button
        type="reset"
        variant="destructive"
        className={cn("h-10", className)}
        onClick={handleReset}
      >
        Resetta
      </Button>
    )
  );
}
