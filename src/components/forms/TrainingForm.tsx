"use client";

import { dailyTrainingSchema } from "@/lib/schema/dailyTraining";
import { DailyTrainingSchemaType, Training } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import SubmitBtn from "../SubmitBtn";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { createTraining, editTraining } from "@/actions/dailyTrainings";
import ImgFormField from "../ImgFormField";
import { useRouter } from "next/navigation";

type Props = {
  eventId: number;
  eventName: string;
  trainingTimestamp: Date;
  training?: Omit<Training, "trainingDate">;
  onSubmitSuccess?: () => void;
};

export default function TrainingForm({
  eventId,
  eventName,
  training,
  trainingTimestamp,
  onSubmitSuccess,
}: Props) {
  const router = useRouter();

  const form = useForm<DailyTrainingSchemaType>({
    resolver: zodResolver(dailyTrainingSchema),
    defaultValues: {
      eventId,
      trainingTimestamp,
      img: training?.imageUrl,
      description: training?.description ?? undefined,
    },
  });

  async function onSubmit(data: DailyTrainingSchemaType) {
    const action = !training
      ? createTraining
      : editTraining.bind(null, data, training.id);

    const res = await action(data);

    if (res?.error) {
      toast.error(res?.message ?? "Errore nel caricamento dell'allenamento", {
        duration: 7_000,
      });
      return;
    }

    toast.success("Allenamento caricato con successo!");

    router.refresh();
    onSubmitSuccess?.();
  }

  return (
    <Form {...form}>
      {form.formState.errors?.trainingTimestamp && (
        <p className="bg-destructive text-sm rounded-lg p-3 text-destructive-foreground">
          {form.formState.errors.trainingTimestamp.message}
        </p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <ImgFormField
          alt={
            training?.description ||
            `Allenamento ${eventName} del giorno ${trainingTimestamp.toLocaleDateString()}`
          }
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea className="text-sm min-h-20" {...field} />
              </FormControl>
              <FormDescription>
                La descrizione dell'allenamento e' opzionale
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitBtn
          className="!mt-4"
          label={training ? "Modifica allenamento" : "Crea allenamento"}
          loadingLabel={training ? "Modificando" : "Creando"}
        />
      </form>
    </Form>
  );
}
