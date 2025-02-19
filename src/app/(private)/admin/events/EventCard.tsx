import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Calendar,
  Pencil,
  Trash2,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Event } from "@/types";
import Link from "next/link";
import { deleteEvent } from "@/actions/events";
import { cn } from "@/lib/utils";

type Props = {
  event: Event;
  className?: string
  showHeader?: boolean;
  showFooter?: boolean;
};

export function EventCard({
  event: {
    id,
    name,
    description,
    imageUrl,
    durationMinutes,
    capacity,
    bookingCutoffMinutes,
    cancellationCutoffMinutes,
  },
  className,
  showHeader = true,
  showFooter = true,
}: Props) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {showHeader && (
        <CardHeader className="p-0">
          <div className="relative h-48">
            <Image
              src={imageUrl || "https://placehold.co/100"}
              alt={name}
              layout="fill"
              objectFit="cover"
              priority={true}
            />
            <div className="p-2 flex justify-end items-center gap-2 absolute right-0">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/events/${id}/edit`}>
                  <Pencil />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Sei sicuro di voler eliminare questo evento?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Questa azione non può essere annullata. L'evento verrà
                      eliminato permanentemente dal sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <form action={deleteEvent}>
                      <input type="text" name="id" value={id} readOnly hidden />
                      <AlertDialogAction asChild>
                        <Button
                          type="submit"
                          variant="destructive"
                          className="bg-destructive text-destructive-foreground w-full"
                        >
                          Elimina
                        </Button>
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{durationMinutes} minuti</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Capacità: {capacity}</span>
          </div>
          {bookingCutoffMinutes && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Prenotazione entro: {bookingCutoffMinutes} minuti prima
              </span>
            </div>
          )}
          {cancellationCutoffMinutes && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Cancellazione entro: {cancellationCutoffMinutes} minuti prima
              </span>
            </div>
          )}
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter className="p-4 flex justify-end items-center gap-2">
          <Button asChild>
            <Link href={`/admin/events/${id}/set-schedule`}>
              <NotebookPen />
              Gestisci programma
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
