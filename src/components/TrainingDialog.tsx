import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/drizzle/db";
import { format } from "date-fns";
import CreateDailyTrainingForm from "./forms/TrainingForm";
import TrainingImg from "./TrainingImg";

type Props = { eventId: number; isAdmin: boolean; trainingTimestamp: Date };

export default async function TrainingDialog({
  eventId,
  isAdmin,
  trainingTimestamp,
}: Props) {
  const training = await db.query.dailyTrainings.findFirst({
    columns: {
      id: true,
      description: true,
      imageUrl: true,
    },
    where: ({ eventId: trainingEventId, trainingDate }, { and, eq }) =>
      and(
        eq(trainingEventId, eventId),
        eq(trainingDate, format(trainingTimestamp, "yyyy-MM-dd"))
      ),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-xs hover:underline font-medium text-blue-600 cursor-pointer">
          {isAdmin && !training ? "Carica allenamento" : "Vedi allenamento"}
        </p>
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Allenamento di oggi</DialogTitle>
        </DialogHeader>
        {isAdmin ? (
          <CreateDailyTrainingForm
            eventId={eventId}
            training={training}
            trainingTimestamp={trainingTimestamp}
          />
        ) : training ? (
          <>
            <p className="text-center">{training.description}</p>
            <TrainingImg {...training} />
          </>
        ) : (
          <p>Il trainer deve ancora caricare l'allenamento</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
