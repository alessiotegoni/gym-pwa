import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { TrainingsEventsList } from "./TrainingsEventsList";
import SearchBar from "@/components/SearchBar";
import { DatePicker } from "@/components/DatePicker";
import CreateEventCta from "@/components/CreateEventCta";
import { getEventsTrainings } from "@/lib/queries";

export type TrainingSearchParams = Awaited<Props["searchParams"]>;

export const metadata: Metadata = {
  title: "Gestione Allenamenti",
  description: "Crea e visualizza gli allenamenti giornalieri",
};

type Props = {
  searchParams: Promise<{
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4">
          <SearchBar search={params.search} placeholder="Cerca allenamento" />
          <DatePicker selectedDate={params.date} className="w-full h-10 rounded-xl" />
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
