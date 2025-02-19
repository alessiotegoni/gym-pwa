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
  const dailyTraining = await db.query.dailyTrainings.findFirst({
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
  // const dailyTraining = {
  //   id: 1,
  //   description: "Allenamento di resistenza con esercizi a corpo libero.",
  //   eventId: 43,
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1737100593814-8ceb04f29cca?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   trainingDate: "2025-02-04",
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-xs hover:underline font-medium text-blue-600 cursor-pointer">
          {isAdmin && !dailyTraining
            ? "Carica allenamento"
            : "Vedi allenamento"}
        </p>
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Allenamento di oggi</DialogTitle>
        </DialogHeader>
        {isAdmin ? (
          <CreateDailyTrainingForm
            eventId={eventId}
            dailyTraining={dailyTraining}
            trainingTimestamp={trainingTimestamp}
          />
        ) : dailyTraining ? (
          <>
            <p className="text-center">{dailyTraining.description}</p>
            <TrainingImg {...dailyTraining} />
          </>
        ) : (
          <p>Il trainer deve ancora caricare l'allenamento</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
