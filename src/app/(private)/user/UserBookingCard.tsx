import { format, addMinutes } from "date-fns";
import { it } from "date-fns/locale";
import Image from "next/image";
import { CalendarDays, Info, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getUserBookings } from "./page";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteBookingBtn from "../admin/bookings/DeleteBookingBtn";

type Props = {
  booking: Awaited<ReturnType<typeof getUserBookings>>[0];
};

export default function UserBookingCard({ booking }: Props) {
  const startTime = booking.schedule.startTime;
  const endTime = format(
    addMinutes(
      new Date(`${booking.bookingDate.toDateString()} ${startTime}`),
      booking.schedule.event.durationMinutes
    ),
    "HH:mm"
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-[auto_1fr_auto]">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={booking.schedule.event.imageUrl || "/placeholder.svg"}
                alt={booking.schedule.event.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{booking.schedule.event.name}</h3>
              <p className="text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4 inline mr-1" />
                {format(booking.bookingDate, "d MMMM", { locale: it })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{startTime}</p>
            <p className="text-sm text-muted-foreground">- {endTime}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {booking.schedule.bookings.length}/
              {booking.schedule.event.capacity}
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
                {booking.schedule.bookings.length ? (
                  <>
                    <p>Lista degli utenti prenotati per questa sessione.</p>
                    <ScrollArea className="h-[270px] pr-4">
                      <ul className="flex flex-wrap gap-y-4 mt-4">
                        {booking.schedule.bookings.map((booking) => (
                          <li
                            key={booking.id}
                            className="flex flex-col jus items-center gap-3 basis-1/3"
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
                              {booking.user.firstName} {booking.user.lastName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </>
                ) : (
                  <p>non ci sono utenti prenotati per questa sessione</p>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <DeleteBookingBtn bookingId={booking.id} variant="destructive">
            Elimina
            <Trash2 />
          </DeleteBookingBtn>
        </div>
      </CardContent>
    </Card>
  );
}
