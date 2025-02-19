"use client";

import { useEffect, useState } from "react";
import { DailyTraining } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Training from "./Training";
import { TrainingSearchParams } from "./page";

type Training = Omit<DailyTraining, "eventId">;

type Props = {
  eventId: number;
  eventName: string;
  trainings: Training[];
  searchParams: TrainingSearchParams;
};

export function TrainingsList({
  eventId,
  eventName,
  trainings,
  searchParams: { date, search },
}: Props) {
  const [eventTrainings, setEventTrainings] = useState(trainings);
  const pathname = usePathname();

  useEffect(() => {
    setEventTrainings(trainings);
  }, [trainings]);

  return eventTrainings.length ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {eventTrainings.map((training) => (
        <Training
          key={training.id}
          eventId={eventId}
          eventName={eventName}
          training={training}
        />
      ))}
      {trainings.length === 10 && eventTrainings.length > 0 && (
        <Link
          href={`${pathname}?nextCursor=${eventTrainings.at(-1)?.id}`}
          className="text-center text-sm text-blue-800 hover:underline"
        >
          Vedi altri
        </Link>
      )}
    </div>
  ) : (
    <p className="text-muted-foreground">
      Nessun allenamento programmato {" "}
      {date && `in data: ${date}`}
    </p>
  );
}
