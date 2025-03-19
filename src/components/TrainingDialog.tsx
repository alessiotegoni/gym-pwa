import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/drizzle/db";
import TrainingForm from "./forms/TrainingForm";
import TrainingImg from "./TrainingImg";
import { formatDate } from "@/lib/utils";

type Props = {
  eventId: number;
  eventName: string;
  isAdmin: boolean;
  trainingTimestamp: Date;
};

export default async function TrainingDialog({
  eventId,
  eventName,
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
        eq(trainingDate, formatDate(trainingTimestamp))
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
          <TrainingForm
            eventId={eventId}
            eventName={eventName}
            training={training}
            trainingTimestamp={trainingTimestamp}
          />
        ) : training ? (
          <>
            <p className="text-center">{training.description}</p>
            <TrainingImg
              training={training}
              alt={
                training.description ||
                `Allenamento ${eventName} del giorno ${trainingTimestamp.toLocaleDateString()}`
              }
            />
          </>
        ) : (
          <p>Il trainer deve ancora caricare l'allenamento</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
