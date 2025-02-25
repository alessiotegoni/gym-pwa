import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function BtnFixedContainer({
  children,
  className
}: PropsWithChildren & { className?: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-[85px] left-1/2 -translate-x-1/2 w-full px-3",
        className
      )}
    >
      {children}
    </div>
  );
}
