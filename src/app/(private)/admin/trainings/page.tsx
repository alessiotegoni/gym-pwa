import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { TrainingsEventsList } from "./TrainingsEventsList";
import SearchBar from "@/components/SearchBar";
import { DatePicker } from "@/components/DatePicker";
import CreateEventCta from "@/components/CreateEventCta";

export type TrainingSearchParams = Awaited<Props["searchParams"]>;

export const getEventsTrainings = async ({
  nextCursor,
  search,
  date,
}: TrainingSearchParams) => {
  const results = await db.query.events.findMany({
    columns: { id: true, name: true },
    with: {
      dailyTrainings: {
        columns: { eventId: false },
        where: (dailyTrainings, { and, lt, eq, like }) => {
          const conditions = [];

          if (nextCursor) {
            conditions.push(lt(dailyTrainings.id, Number.parseInt(nextCursor)));
          }

          if (date) {
            conditions.push(eq(dailyTrainings.trainingDate, date));
          }

          if (search) {
            conditions.push(like(dailyTrainings.description, `%${search}%`));
          }

          return and(...conditions);
        },
        orderBy: ({ trainingDate }, { asc }) => asc(trainingDate),
        limit: 10,
      },
    },
    where: search
      ? (events, { like }) => like(events.name, `%${search}%`)
      : undefined,
  });

  return results;
};

export const metadata: Metadata = {
  title: "Gestione Allenamenti",
  description: "Crea e visualizza gli allenamenti giornalieri",
};

type Props = {
  searchParams: Promise<{
    nextCursor?: string;
    search?: string;
    date?: string;
  }>;
};

export default async function TrainingsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.userId) return null;

  const params = await searchParams;
  const events = await getEventsTrainings(params);

  return (
    <>
      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Gestione Allenamenti
        </h2>
        <div className="flex flex-col sm:flex-row gap-x-4">
          <SearchBar search={params.search} placeholder="Cerca allenamento" />
          <DatePicker selectedDate={params.date} className="h-10" />
        </div>
      </div>
      {!events.length && !params.search && !params.date ? (
        <CreateEventCta />
      ) : (
        <TrainingsEventsList events={events} searchParams={params} />
      )}
    </>
  );
}
