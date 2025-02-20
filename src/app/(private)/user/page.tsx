import { auth } from "@/lib/auth";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import UserBookingCard from "./UserBookingCard";
import { getUserBookings } from "@/lib/queries";

export const metadata = {
  title: "Le mie prenotazioni",
  description: "Vedi le tue prenotazioni",
};

export default async function UserPage() {
  const session = await auth();

  if (!session?.userId) return;

  const bookings = await getUserBookings(session.userId);

  const groupedBookings = Object.groupBy(bookings, (booking) =>
    booking.schedule.event.id.toString()
  );

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Le mie prenotazioni</h2>
      {!bookings.length ? (
        <div
          className="flex flex-col items-center justify-center
          p-4 py-6 bg-secondary rounded-xl"
        >
          <AlertCircle className="!size-12" />
          <p className="text-center text-muted-foreground mt-3">
            Non hai prenotazioni attive al momento
          </p>
          <Button className="mt-5" asChild>
            <Link href="/schedule">Prenota ora</Link>
          </Button>
        </div>
      ) : (
        Object.entries(groupedBookings).map(
          ([eventId, bookings]) =>
            !!bookings?.length && (
              <Fragment key={eventId}>
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    {bookings[0].schedule.event.name}
                  </h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking) => (
                    <UserBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </Fragment>
            )
        )
      )}
    </>
  );
}
