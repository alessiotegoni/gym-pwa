import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import UserBookingCard from "./UserBookingCard";

export const metadata = {
  title: "Le mie prenotazioni",
  description: "Vedi le tue prenotazioni",
};

export const getUserBookings = async (id: number) =>
  await db.query.bookings.findMany({
    where: ({ userId, bookingDate }, { and, gte, eq }) =>
      and(eq(userId, id), gte(bookingDate, new Date())),
    with: {
      schedule: {
        columns: { startTime: true },
        with: {
          bookings: {
            where: ({ bookingDate }, { gte }) => gte(bookingDate, new Date()),
            columns: { id: true },
            with: {
              user: {
                columns: { firstName: true, lastName: true, image: true },
              },
            },
          },
          event: {
            columns: {
              id: true,
              name: true,
              imageUrl: true,
              capacity: true,
              durationMinutes: true,
            },
          },
        },
      },
    },
    orderBy: (bookings, { asc }) => [asc(bookings.bookingDate)],
  });
const bookings: {
  id: number;
  createdAt: Date;
  scheduleId: number;
  userId: number;
  bookingDate: Date;
  schedule: {
    startTime: string;
    bookings: {
      id: number;
      user: {
        firstName: string;
        lastName: string;
        image: string | null;
      };
    }[];
    event: {
      id: number;
      name: string;
      imageUrl: string;
      durationMinutes: number;
      capacity: number;
      dailyTrainingImages: {
        id: number;
        description: string | null;
        eventId: number;
        imageUrl: string;
        trainingDate: string;
      }[];
    };
  };
}[] = [
  {
    id: 1,
    createdAt: new Date("2024-02-01T10:15:00Z"),
    scheduleId: 201,
    userId: 1,
    bookingDate: new Date("2024-02-10"),
    schedule: {
      startTime: "08:00",
      bookings: [
        {
          id: 11,
          user: {
            firstName: "Alice",
            lastName: "Johnson",
            image: "",
          },
        },
        {
          id: 12,
          user: { firstName: "Bob", lastName: "Smith", image: null },
        },
      ],
      event: {
        id: 43,
        name: "Yoga Morning Session",
        imageUrl: "",
        durationMinutes: 60,
        capacity: 20,
        dailyTrainingImages: [
          {
            id: 101,
            description: "Morning sun salutations",
            eventId: 201,
            imageUrl: "",
            trainingDate: "2024-02-10",
          },
          {
            id: 102,
            description: null,
            eventId: 201,
            imageUrl: "",
            trainingDate: "2024-02-11",
          },
        ],
      },
    },
  },
  {
    id: 2,
    createdAt: new Date("2024-02-02T12:30:00Z"),
    scheduleId: 202,
    userId: 2,
    bookingDate: new Date("2024-02-15"),
    schedule: {
      startTime: "18:00",
      bookings: [
        {
          id: 21,
          user: {
            firstName: "Daniel",
            lastName: "White",
            image: "",
          },
        },
        {
          id: 22,
          user: { firstName: "Emma", lastName: "Taylor", image: null },
        },
      ],
      event: {
        id: 23,
        name: "HIIT Workout",
        imageUrl: "",
        durationMinutes: 45,
        capacity: 15,
        dailyTrainingImages: [
          {
            id: 201,
            description: "Intense cardio session",
            eventId: 202,
            imageUrl: "",
            trainingDate: "2024-02-15",
          },
        ],
      },
    },
  },
  {
    id: 3,
    createdAt: new Date("2024-02-03T14:45:00Z"),
    scheduleId: 203,
    userId: 3,
    bookingDate: new Date("2024-02-20"),
    schedule: {
      startTime: "10:00",
      bookings: [
        {
          id: 31,
          user: {
            firstName: "George",
            lastName: "Miller",
            image: "",
          },
        },
      ],
      event: {
        id: 43,
        name: "Yoga Morning Session",
        imageUrl: "",
        durationMinutes: 50,
        capacity: 10,
        dailyTrainingImages: [
          {
            id: 301,
            description: "Stretching and core strengthening",
            eventId: 203,
            imageUrl: "",
            trainingDate: "2024-02-20",
          },
        ],
      },
    },
  },
  {
    id: 4,
    createdAt: new Date("2024-02-04T09:10:00Z"),
    scheduleId: 204,
    userId: 4,
    bookingDate: new Date("2024-02-22"),
    schedule: {
      startTime: "07:00",
      bookings: [
        {
          id: 41,
          user: {
            firstName: "Hannah",
            lastName: "Moore",
            image: "",
          },
        },
        {
          id: 42,
          user: { firstName: "Isaac", lastName: "Anderson", image: null },
        },
      ],
      event: {
        id: 48,
        name: "Crossfit Challenge",
        imageUrl: "",
        durationMinutes: 60,
        capacity: 25,
        dailyTrainingImages: [
          {
            id: 401,
            description: "Heavy lifting and endurance training",
            eventId: 204,
            imageUrl: "",
            trainingDate: "2025-02-04",
          },
        ],
      },
    },
  },
];

export default async function UserPage() {
  const session = await auth();

  if (!session?.userId) return;

  // const bookings = getUserBookings(session.userId)

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
