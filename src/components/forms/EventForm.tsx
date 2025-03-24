"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Event, EventSchemaType } from "@/types";
import { eventSchema } from "@/lib/schema/event";
import { createEvent, editEvent } from "@/actions/events";
import SubmitBtn from "../SubmitBtn";
import FormAlert from "../FormAlert";
import ImgFormField from "../ImgFormField";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BtnFixedContainer from "../BtnFixedContainer";

interface EventFormProps {
  event?: EventSchemaType & Pick<Event, "id">;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();

  const form = useForm<EventSchemaType>({
    resolver: zodResolver(eventSchema),
    defaultValues: event || {
      name: "",
      description: "",
      durationMinutes: 60,
      capacity: 30,
      bookingCutoffMinutes: null,
      cancellationCutoffMinutes: null,
    },
  });

  async function handleSubmit(data: EventSchemaType) {
    const action = !event ? createEvent : editEvent.bind(null, data, event.id);

    const res = await action(data);

    if (res?.error) {
      toast.error(
        res?.message || "Si è verificato un errore. Riprova più tardi."
      );
      return;
    }

    toast.success(
      event ? "Evento aggiornato con successo." : "Evento creato con successo."
    );

    router.push("/admin/events");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome dell'evento</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il nome dell'evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImgFormField alt={event?.name || ""} />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrivi l'evento"
                  {...field}
                  value={field.value as string}
                  className="h-20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durata (minuti)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  value={!isNaN(field.value) ? field.value : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacità</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  value={!isNaN(field.value) ? field.value : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bookingCutoffMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo limite per la prenotazione (minuti)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(!isNaN(value) ? value : null);
                  }}
                  value={
                    field.value ? (!isNaN(field.value) ? field.value : "") : ""
                  }
                />
              </FormControl>
              <FormDescription>
                Lascia vuoto se non c'è un limite
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cancellationCutoffMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo limite per la cancellazione (minuti)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(!isNaN(value) ? value : null);
                  }}
                  value={
                    field.value ? (!isNaN(field.value) ? field.value : "") : ""
                  }
                />
              </FormControl>
              <FormDescription>
                Lascia vuoto se non c'è un limite
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <BtnFixedContainer>
          <SubmitBtn
            label={event ? "Modifica evento" : "Crea evento"}
            loadingLabel={event ? "Modificando" : "Creando"}
          />
        </BtnFixedContainer>
      </form>
    </Form>
  );
}
