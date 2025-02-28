import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function BtnFixedContainer({
  children,
  className
}: PropsWithChildren & { className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-[100px] left-1/2 w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
