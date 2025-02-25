import { auth } from "@/lib/auth";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import UserBookingCard from "./UserBookingCard";
import { getUserBookings, hasSubscription } from "@/lib/queries";
import { format, isToday, isTomorrow } from "date-fns";
import { it } from "date-fns/locale";
import CreateSubscriptionCard from "@/components/CreateSubscriptionCard";
import PaymentAlert from "@/components/PaymentAlert";

export const metadata = {
  title: "Le mie prenotazioni",
  description: "Vedi le tue prenotazioni",
};

type Props = {
  searchParams: Promise<{ success?: boolean; failed?: boolean }>;
};

export default async function UserPage({ searchParams }: Props) {
  const [session, { success, failed }] = await Promise.all([
    auth(),
    searchParams,
  ]);

  if (!session?.userId) return;

  const isSubscripted = await hasSubscription(session.userId);

  if (!isSubscripted)
    return (
      <>
        {failed && <PaymentAlert failed />}
        <CreateSubscriptionCard />
      </>
    );

  const bookings = await getUserBookings(session.userId);

  const groupedBookings = Object.groupBy(bookings, (booking) =>
    booking.bookingDate.toDateString()
  );

  return (
    <>
      {isSubscripted && success && <PaymentAlert success />}
      <h2 className="text-2xl font-bold mb-2">Le mie prenotazioni</h2>
      {!bookings.length ? (
        <div
          className="flex flex-col items-center justify-center
          p-4 py-6 bg-secondary rounded-xl"
        >
          <AlertCircle className="!size-12" />
          <p className="text-center font-medium mt-3">
            Non hai prenotazioni attive al momento
          </p>
          <Button className="mt-5 text-black font-semibold" asChild>
            <Link href="/schedule">Prenota ora</Link>
          </Button>
        </div>
      ) : (
        Object.entries(groupedBookings).map(([bookingDate, bookings]) => {
          const date = new Date(bookingDate);

          return (
            !!bookings?.length && (
              <Fragment key={bookingDate}>
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    {isToday(date)
                      ? "Oggi"
                      : isTomorrow(date)
                      ? "Domani"
                      : format(date, "d MMMM", { locale: it })}
                  </h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking) => (
                    <UserBookingCard
                      key={booking.id}
                      booking={booking}
                      userId={session.userId}
                    />
                  ))}
                </div>
              </Fragment>
            )
          );
        })
      )}
    </>
  );
}
