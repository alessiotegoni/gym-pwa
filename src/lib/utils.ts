import { subscriptionStatuses } from "@/app/(private)/subscriptions/Subscription";
import {
  Bookings,
  EventSchedules,
  EventScheduleSchemaType,
  SubscriptionStatus,
  WeekDay,
} from "@/types";
import { clsx, type ClassValue } from "clsx";
import {
  addMinutes,
  format,
  isValid,
  parse,
  roundToNearestMinutes,
  startOfDay,
} from "date-fns";
import { it } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "./schema/image";
import { pinata } from "./configs";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
          Object.groupBy(
            dayBookings ?? [],
            (dayBooking) => dayBooking.schedule.startTime
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

export const getBookingTime = (time: string) =>
  parse(time, "HH:mm", new Date());

// export const isToday = (day: string) => {
//   const currentDay = format(new Date(), "EEEE", { locale: it });
//   return day === currentDay;
// };

export const getCurrentTime = () => {
  const now = new Date();
  return parse(format(now, "HH:mm"), "HH:mm", now);
};

export const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

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
