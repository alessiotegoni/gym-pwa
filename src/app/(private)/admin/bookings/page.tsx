import SearchUserBar from "@/components/SearchBar";
import { filterByUsers, groupBookings } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { isToday } from "date-fns";
import { RefreshCw } from "lucide-react";
import { revalidatePath } from "next/cache";
import SubmitBtn from "@/components/SubmitBtn";
import { getBookings } from "@/lib/queries";
import AdminBookingCard from "./AdminBookingCard";

export const metadata = {
  title: "Gestisci prenotazioni",
  description: "Visualizza e gestisci le prenotazioni dei tuoi utenti",
};

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function BookingsPage({ searchParams }: Props) {
  const [session, bookings, { search }] = await Promise.all([
    auth(),
    getBookings(),
    searchParams,
  ]);

  if (!session?.userId) return;

  const filteredBookings = filterByUsers(bookings, search);
  const groupedBookings = groupBookings(filteredBookings);

  return (
    <>
      <header className="mb-4">
        <h2 className="text-3xl font-bold mb-4">Gestione Prenotazioni</h2>
        <SearchUserBar search={search} />
        <div className="flex justify-between items-center mt-4">
          <h3 className="text-lg font-medium">
            Totale prenotazioni: <strong>{filteredBookings.length}</strong>
          </h3>
          <form
            action={async () => {
              "use server";
              revalidatePath("/admin/bookings", "page");
            }}
          >
            <SubmitBtn
              variant="ghost"
              size="sm"
              className="text-black dark:text-white !bg-transparent"
            >
              <RefreshCw className="!size-5" />
            </SubmitBtn>
          </form>
        </div>
      </header>

      <div className="space-y-4">
        {Object.entries(groupedBookings).map(([id, days]) => (
          <AdminBookingCard
            key={id}
            event={
              bookings.find((b) => b.schedule?.event.id.toString() === id)
                ?.schedule?.event!
            }
            todayBookings={
              filteredBookings.filter(
                (booking) =>
                  booking?.schedule?.event.id.toString() === id &&
                  isToday(booking.bookingDate)
              ).length
            }
            days={days}
            isAdmin={session.isAdmin}
            search={search?.toLowerCase()}
          />
        ))}
      </div>
    </>
  );
}
