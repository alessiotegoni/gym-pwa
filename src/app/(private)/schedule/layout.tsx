import { ReactNode } from "react";
import ScheduleDate from "./ScheduleDate";
import { Carousel } from "@/components/ui/carousel";

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <Carousel className="w-full max-w-sm h-full">
      <ScheduleDate />
      {children}
    </Carousel>
  );
}
