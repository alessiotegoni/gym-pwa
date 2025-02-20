"use client";

import { Event, EventsWithSchedules } from "@/types";
import { addMinutes, format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarDays, Info, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DAYS_OF_WEEK_IN_ORDER, giorniSettimana } from "@/constants";
import { useSchedule } from "@/context/ScheduleProvider";

type Props = {
  event: Event;
  schedules: EventsWithSchedules[0]["schedules"];
  userId: number;
};

export default function EventScheduleList({ event, schedules, userId }: Props) {
  const { currentDate } = useSchedule();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {schedules.map((schedule) => {
        const startTime = new Date(`2000-01-01T${schedule.startTime}`);
        const endTime = format(
          addMinutes(startTime, event.durationMinutes),
          "HH:mm"
        );

        const isBooked = schedule.bookings.some(
          (booking) => booking.user.id === userId
        );

        return (
          <Card key={schedule.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-[auto_1fr_auto]">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.name}
                      objectFit="cover"
                      fill
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">
                      {
                        giorniSettimana[
                          DAYS_OF_WEEK_IN_ORDER.indexOf(schedule.day)
                        ]
                      }
                    </h3>
                    <p className="text-sm flex items-center gap-1 text-muted-foreground">
                      <CalendarDays className="size-4" />
                      {format(currentDate, "d MMMM", {
                        locale: it,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {format(startTime, "HH:mm")}
                  </p>
                  <p className="text-sm text-muted-foreground">- {endTime}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {schedule.bookings.length}/{event.capacity}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info />
                        Dettagli
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl">
                      <DialogHeader>
                        <DialogTitle>Utenti prenotati</DialogTitle>
                      </DialogHeader>
                      {schedule.bookings.length ? (
                        <>
                          <p>
                            Lista degli utenti prenotati per questa sessione.
                          </p>
                          <ScrollArea className="h-[270px] pr-4">
                            <ul className="flex flex-wrap gap-y-4 mt-4">
                              {schedule.bookings.map((booking) => (
                                <li
                                  key={booking.id}
                                  className="flex flex-col items-center gap-3 basis-1/3"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={booking.user.image || undefined}
                                      alt={`${booking.user.firstName} ${booking.user.lastName}`}
                                    />
                                    <AvatarFallback>
                                      {booking.user.firstName[0].toUpperCase()}
                                      {booking.user.lastName[0].toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-center text-sm">
                                    {booking.user.firstName}{" "}
                                    {booking.user.lastName}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </ScrollArea>
                        </>
                      ) : (
                        <p>Non ci sono utenti prenotati per questa sessione</p>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                {!isBooked ? (
                  <Button variant="default">Prenota</Button>
                ) : (
                  <Button variant="destructive" size="sm">
                    <Trash2 />
                    Elimina
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
