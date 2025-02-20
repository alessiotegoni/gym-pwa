import ScheduleProvider from "@/context/ScheduleProvider";
import { ReactNode } from "react";
import ScheduleDate from "./ScheduleDate";

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <ScheduleProvider>
      <ScheduleDate />
      {children}
    </ScheduleProvider>
  );
}
