import { DailyTraining } from "@/types";
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
  return trainings.length ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trainings.map((training) => (
        <Training
          key={training.id}
          eventId={eventId}
          eventName={eventName}
          training={training}
        />
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">
      Nessun allenamento programmato {date && `in data: ${date}`}
    </p>
  );
}
