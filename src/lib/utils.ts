import { subscriptionStatuses } from "@/app/(private)/subscriptions/Subscription";
import { Bookings, EventSchedules, SubscriptionStatus } from "@/types";
import { clsx, type ClassValue } from "clsx";
import {
  addDays,
  addMinutes,
  format,
  isAfter,
  isBefore,
  isToday,
  isValid,
  isWithinInterval,
  parse,
  roundToNearestMinutes,
  set,
  setMinutes,
  startOfDay,
  subDays,
  subMinutes,
} from "date-fns";
import { it } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "./schema/image";
import { pinata } from "./configs";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const formatSubStatus = (status: SubscriptionStatus) =>
  subscriptionStatuses[status].text.slice(0, -1) +
  subscriptionStatuses[status].text.slice(-1).replace("o", "i");

export function filterByUsers<
  T extends { user: { firstName: string; lastName: string; email: string } }
>(arr: T[], search?: string): T[] {
  if (!search) return arr;

  const searchLower = search.toLowerCase();

  return arr.filter(
    (item) =>
      item.user.firstName.toLowerCase().includes(searchLower) ||
      item.user.lastName.toLowerCase().includes(searchLower) ||
      item.user.email.toLowerCase().includes(searchLower)
  );
}

export function groupBookings(bookings: Bookings) {
  const groupedByEventId = Object.groupBy(bookings, (booking) =>
    booking.schedule.event.id.toString()
  );

  const groupedByDay = Object.fromEntries(
    Object.entries(groupedByEventId).map(([eventName, eventBookings]) => [
      eventName,
      Object.groupBy(eventBookings ?? [], (eventBooking) =>
        format(eventBooking.bookingDate, "EEEE", { locale: it })
      ),
    ])
  );

  const groupedByStartTime = Object.fromEntries(
    Object.entries(groupedByDay).map(([eventName, days]) => [
      eventName,
      Object.fromEntries(
        Object.entries(days).map(([day, dayBookings]) => [
          day,
          Object.groupBy(dayBookings ?? [], (dayBooking) =>
            dayBooking.schedule.startTime.slice(0, 5)
          ),
        ])
      ),
    ])
  );

  return groupedByStartTime;
}

export function getSchedulesEntries(
  schedules: EventSchedules,
  eventDuration: number
) {
  const scheduleEntries = DAYS_OF_WEEK_IN_ORDER.map((day) => {
    const daySchedules = schedules.filter((schedule) => schedule.day === day);

    const defaultStartTime = roundToNearestMinutes(new Date(), {
      nearestTo: 30,
    });

    return [
      day,
      daySchedules.length
        ? daySchedules.map(({ startTime, isActive }) => {
            const parsedStartTime = parse(startTime, "HH:mm:ss", new Date());

            return {
              startTime: format(parsedStartTime, "HH:mm"),
              endTime: format(
                addMinutes(parsedStartTime, eventDuration),
                "HH:mm"
              ),
              isActive,
            };
          })
        : !["saturday", "sunday"].includes(day)
        ? [
            {
              startTime: format(defaultStartTime, "HH:mm"),
              endTime: format(
                addMinutes(defaultStartTime, eventDuration),
                "HH:mm"
              ),
              isActive: true,
            },
          ]
        : [],
    ];
  });

  return scheduleEntries;
}

// export const groupBookings = (bookings: Bookings): GroupedBookings =>
//   bookings.reduce((acc, booking) => {
//     const { event, day, startTime } = booking.schedule;
//     if (!acc[event.name]) {
//       acc[event.name] = {};
//     }
//     if (!acc[event.name][day]) {
//       acc[event.name][day] = {};
//     }
//     if (!acc[event.name][day][startTime]) {
//       acc[event.name][day][startTime] = [];
//     }
//     acc[event.name][day][startTime].push(booking);
//     return acc;
//   }, {} as GroupedBookings);

export const getBookingTime = (time: string) => {
  if (!time || typeof time !== "string") {
    throw new Error("Orario non valido");
  }

  const parsedTime = parse(time, "HH:mm", new Date());

  if (!isValid(parsedTime)) {
    throw new Error(`Formato orario non valido: ${time}`);
  }

  return parsedTime;
};

export const getBookingDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return set(date, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });
};

// export const isToday = (day: string) => {
//   const currentDay = format(new Date(), "EEEE", { locale: it });
//   return day === currentDay;
// };

export const getCurrentTime = () => {
  const now = new Date();
  return parse(format(now, "HH:mm"), "HH:mm", now);
};

export const getNext7Dates = () => {
  const nextDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return nextDates;
};

export const getDay = (date: Date) => format(date, "EEEE").toLowerCase();

export const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

type BookingOperableParams = {
  type: "create" | "delete";
  bookingDate: Date;
  cutoffMinutes: number | null;
} & (
  | { type: "create"; eventCapacity: number; bookingsCount: number }
  | { type: "delete" }
);

export const isBookingOperable = (params: BookingOperableParams) => {
  const { type, bookingDate, cutoffMinutes } = params;

  const now = new Date();
  const cutoffDate = subMinutes(bookingDate, cutoffMinutes!);

  switch (type) {
    case "create":
      const { bookingsCount, eventCapacity } = params;
      if (bookingsCount >= eventCapacity) return false;

      return isWithinInterval(now, {
        start: subDays(bookingDate, 2),
        end: !cutoffMinutes ? bookingDate : cutoffDate,
      });
    case "delete":
      return isBefore(now, !cutoffMinutes ? bookingDate : cutoffDate);
  }
};

export const isTrainingEditable = (trainingDate: string | Date) => {
  const parsedTrainingDate =
    trainingDate instanceof Date
      ? trainingDate
      : parse(trainingDate, "yyyy-MM-dd", new Date());
  const startOfToday = startOfDay(new Date());

  return parsedTrainingDate >= startOfToday;
};

export const isValidImage = ({ type, size }: File) => {
  let isValid = true;
  let message = "";

  if (!ACCEPTED_FILE_TYPES.includes(type)) {
    isValid = false;
    message = "Formato file non valido. Usa JPEG, PNG, WEBP o HEIC.";
  }

  if (size > MAX_FILE_SIZE) {
    isValid = false;
    message = "Il file è troppo pesante. Dimensione massima: 5MB.";
  }

  return { isValid, message };
};

export const uploadImg = async (file: File) => {
  const upload = await pinata.upload.file(file);
  const url = await pinata.gateways.convert(upload.IpfsHash);

  return url;
};
