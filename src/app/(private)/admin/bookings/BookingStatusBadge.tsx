import { Badge } from "@/components/ui/badge";
import { COURSE_STATUSES } from "@/constants/index";
import { cn } from "@/lib/utils";

const courseStatuses: Record<
  Props["status"],
  {
    className: string;
    text: string;
  }
> = {
  in_progress: {
    className: `bg-green-100 text-green-800 ring ring-1 ring-green-800/40
    before:absolute before:inset-0 before:animate-ping before:bg-green-500
    before:opacity-50 before:rounded-full`,
    text: "In corso",
  },
  coming: {
    className: "bg-blue-100 text-blue-800 ring ring-1 ring-blue-800/40",
    text: "Prossimo",
  },
  open: {
    className: "bg-blue-100 text-blue-800 ring ring-1 ring-blue-800/40",
    text: "Aperto",
  },
  terminated: {
    className: "bg-red-100 text-red-800 ring ring-1 ring-red-800/40",
    text: "Terminato",
  },
};

type Props = {
  status: (typeof COURSE_STATUSES)[number];
  className?: string;
};
export default function BookingStatusBadge({ status, className = "" }: Props) {
  return (
    status !== "open" && (
      <Badge
        className={cn(
          "rounded-full relative",
          courseStatuses[status].className,
          className
        )}
      >
        {courseStatuses[status].text}
      </Badge>
    )
  );
}
