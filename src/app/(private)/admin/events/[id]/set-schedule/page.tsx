import { getEvent } from "@/lib/queries";
import { notFound } from "next/navigation";
import { EventCard } from "../../EventCard";
import SchedulesList from "./SchedulesList";
import { Suspense } from "react";

export const metadata = {
  title: "Gestisci programma",
  description: "Gestisci la programmazione dell'evento",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SetEventSchedulePage({ params }: Props) {
  const eventId = parseInt((await params).id);
  if (isNaN(eventId)) return;
  const event = await getEvent(eventId);

  if (!event) notFound();

  return (
    <>
      <section>
        <h2 className="text-xl font-bold mb-4">Evento</h2>
        <EventCard
          event={event}
          showHeader={false}
          showFooter={false}
          className="mb-5"
        />
      </section>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Programmazione</h2>
        <Suspense fallback={<p>loading...</p>}>
          <SchedulesList
            eventId={event.id}
            eventDuration={event.durationMinutes}
          />
        </Suspense>
      </section>
    </>
  );
}
