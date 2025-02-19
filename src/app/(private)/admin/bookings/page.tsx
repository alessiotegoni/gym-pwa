import SearchUserBar from "@/components/SearchBar";
import { filterByUsers, groupBookings } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { isToday } from "date-fns";
import { RefreshCw } from "lucide-react";
import { revalidatePath } from "next/cache";
import SubmitBtn from "@/components/SubmitBtn";
import { getBookings } from "@/lib/queries";
import AdminBookingCard from "./AdminBookingCard";

let bookings = [
  // Event: Yoga Class (11, 12, 13 Febbraio)
  {
    id: 1,
    createdAt: new Date("2025-02-11T08:00:00.000Z"),
    scheduleId: 101,
    userId: 201,
    bookingDate: new Date("2025-02-18T00:00:00.000Z"),
    user: {
      firstName: "Alice",
      lastName: "Verdi",
      email: "alice.verdi@example.com",
      image: "",
    },
    schedule: {
      id: 101,
      startTime: "09:00",
      event: {
        id: 301,
        name: "Yoga Class",
        capacity: 15,
        durationMinutes: 60,
      },
    },
  },
  {
    id: 2,
    createdAt: new Date("2025-02-11T09:30:00.000Z"),
    scheduleId: 102,
    userId: 202,
    bookingDate: new Date("2025-02-11T00:00:00.000Z"),
    user: {
      firstName: "Luca",
      lastName: "Rossi",
      email: "luca.rossi@example.com",
      image: "",
    },
    schedule: {
      id: 102,
      startTime: "11:00",
      event: {
        id: 301,
        name: "Yoga Class",
        capacity: 15,
        durationMinutes: 60,
      },
    },
  },
  {
    id: 3,
    createdAt: new Date("2025-02-11T10:00:00.000Z"),
    scheduleId: 103,
    userId: 203,
    bookingDate: new Date("2025-02-11T00:00:00.000Z"),
    user: {
      firstName: "Giulia",
      lastName: "Bianchi",
      email: "giulia.bianchi@example.com",
      image: "",
    },
    schedule: {
      id: 103,
      startTime: "17:00",
      event: {
        id: 301,
        name: "Yoga Class",
        capacity: 15,
        durationMinutes: 60,
      },
    },
  },

  // Event: Spinning Class (11, 12, 13 Febbraio)
  {
    id: 4,
    createdAt: new Date("2025-02-11T12:00:00.000Z"),
    scheduleId: 201,
    userId: 204,
    bookingDate: new Date("2025-02-11T00:00:00.000Z"),
    user: {
      firstName: "Marco",
      lastName: "Neri",
      email: "marco.neri@example.com",
      image: "",
    },
    schedule: {
      id: 201,
      startTime: "07:30",
      event: {
        id: 401,
        name: "Spinning Class",
        capacity: 20,
        durationMinutes: 45,
      },
    },
  },
  {
    id: 5,
    createdAt: new Date("2025-02-11T14:00:00.000Z"),
    scheduleId: 202,
    userId: 205,
    bookingDate: new Date("2025-02-11T00:00:00.000Z"),
    user: {
      firstName: "Serena",
      lastName: "Morelli",
      email: "serena.morelli@example.com",
      image: "",
    },
    schedule: {
      id: 202,
      startTime: "19:00",
      event: {
        id: 401,
        name: "Spinning Class",
        capacity: 20,
        durationMinutes: 45,
      },
    },
  },
];

export const metadata = {
  title: "Gestisci prenotazioni",
  description: "Visualizza e gestisci le prenotazioni dei tuoi utenti",
};

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function BookingsPage({ searchParams }: Props) {
  const [session, booking, { search }] = await Promise.all([
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
              bookings.find((b) => b.schedule.event.id.toString() === id)
                ?.schedule.event!
            }
            todayBookings={
              filteredBookings.filter(
                (booking) =>
                  booking.schedule.event.id.toString() === id &&
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
