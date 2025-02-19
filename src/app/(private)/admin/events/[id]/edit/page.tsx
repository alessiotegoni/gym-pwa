import { EventForm } from "@/components/forms/EventForm";
import { getEvent } from "@/lib/queries";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: Props) {
  const eventId = parseInt((await params).id);
  if (isNaN(eventId)) return
  const event = await getEvent(eventId);

  if (!event) notFound();

  const { imageUrl: img, ...restEvent } = event;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Modifica Evento: {event.name}</h1>
      <EventForm event={{ ...restEvent, img }} />
    </>
  );
}
