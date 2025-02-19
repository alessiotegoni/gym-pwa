import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import TrainingDatePicker from "@/components/TrainingDatePicker";
import { EventsTrainings } from "@/types";
import { TrainingsList } from "./TrainingsList";
import { TrainingSearchParams } from "./page";

export function TrainingsEventsList({
  events,
  searchParams,
}: {
  events: EventsTrainings;
  searchParams: TrainingSearchParams;
}) {
  return events.length ? (
    events.map((event) => (
      <Card key={event.id} className="mb-4 last:mb-0">
        <CardHeader>
          <div className="flex justify-between items-center gap-3">
            <CardTitle className="text-xl">{event.name}</CardTitle>
            <TrainingDatePicker
              eventId={event.id}
              eventName={event.name}
              className="!h-fit p-2"
            >
              <PlusCircle className="size-5" />
              Aggiungi
            </TrainingDatePicker>
          </div>
          {!!event.dailyTrainings.length && (
            <CardDescription>
              Allenamenti programmati:{" "}
              <strong>{event.dailyTrainings.length}</strong>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <TrainingsList
            eventId={event.id}
            eventName={event.name}
            trainings={event.dailyTrainings}
            searchParams={searchParams}
          />
        </CardContent>
      </Card>
    ))
  ) : (
    <p>Nessun allenamento trovato</p>
  );
}
