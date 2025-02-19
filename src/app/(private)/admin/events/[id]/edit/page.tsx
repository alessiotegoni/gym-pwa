import { EventForm } from "@/components/forms/EventForm";
import { db } from "@/drizzle/db";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id?: string }>;
};

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  if (!id) return;

  const eventId = parseInt(id);
  if (isNaN(eventId)) return;

  const event = await db.query.events.findFirst({
    where: ({ id }, { eq }) => eq(id, eventId),
  });

  if (!event) notFound();

  const { imageUrl: img, ...restEvent } = event;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Modifica Evento: {event.name}</h1>
      <EventForm event={{ ...restEvent, img }} />
    </>
  );
}
