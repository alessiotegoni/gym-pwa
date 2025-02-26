import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { EventCard } from "./EventCard";
import CreateEventCta from "@/components/CreateEventCta";

export const metadata = {
  title: "Gestione Eventi",
  description: "Crea e visualizza gli eventi",
};

type Props = {
  searchParams: Promise<{
    nextCursor?: string;
    search?: string;
  }>;
};

const getEvents = async (search?: string) =>
  await db.query.events.findMany({
    where: ({ name, description }, { or, ilike }) =>
      search
        ? or(ilike(name, `%${search}%`), ilike(description, `%${search}%`))
        : undefined,
  });

export default async function EventsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.userId) return null;

  const { search } = await searchParams;
  const events = await getEvents(search);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Gestione Eventi</h2>

        {!!events.length && (
          <Button className="text-xs h-fit p-0 size-7 rounded-full" asChild>
            <Link href="/admin/events/create">
              <Plus />
            </Link>
          </Button>
        )}
      </div>
      {!events.length && !search ? (
        <CreateEventCta />
      ) : (
        <>
          <SearchBar search={search} placeholder="Cerca evento" />
          {events.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p>Nessun evento trovato</p>
          )}
        </>
      )}
    </>
  );
}
