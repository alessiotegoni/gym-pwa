import { ReactNode } from "react";
import ScheduleDate from "./ScheduleDate";
import { Carousel } from "@/components/ui/carousel";

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[330px] mx-auto sm:max-w-xl lg:max-w-5xl">
      <Carousel
        className="h-full"
        opts={{
          container: ".container",
        }}
      >
        <ScheduleDate />
        {children}
      </Carousel>
    </div>
  );
}
