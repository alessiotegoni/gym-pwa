import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogContainer,
  MorphingDialogImageProps,
} from "@/components/ui/morphing-dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

export default function MorphingDialogBasicImage({
  className,
  ...props
}: MorphingDialogImageProps) {
  return (
    <MorphingDialog
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <MorphingDialogTrigger>
        <MorphingDialogImage
          {...props}
          className={cn(
            "max-w-xs rounded-[4px] aspect-square object-cover",
            className
          )}
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative overflow-visible">
          <MorphingDialogImage
            {...props}
            className={
              "h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]"
            }
          />
          <MorphingDialogClose
            className="absolute right-0 -top-10 h-fit w-fit rounded-full
             bg-white p-1"
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { delay: 0.3, duration: 0.1 },
              },
              exit: { opacity: 0, transition: { duration: 0 } },
            }}
          >
            <XIcon className="h-5 w-5 text-zinc-500" />
          </MorphingDialogClose>
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
