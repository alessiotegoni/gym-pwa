"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Users } from "lucide-react";
import BookingDetailsTabs from "./BookingDetailsTabs";
import { useState } from "react";

export type BookingDetailsProps = {
  scheduleId: number;
  userId: number;
  bookingDate: Date;
  usersCount: number;
  eventCapacity: number;
};

export default function BookingDetails({
  scheduleId,
  userId,
  bookingDate,
  usersCount,
  eventCapacity,
}: BookingDetailsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Badge variant="secondary" className="flex items-center rounded-lg">
        <Users className="size-4 mr-1" />
        {usersCount}/{eventCapacity}
      </Badge>
      <Dialog onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Info />
            Dettagli
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="mb-1">
              Dettagli dell'allenamento
            </DialogTitle>
          </DialogHeader>
          <BookingDetailsTabs
            scheduleId={scheduleId}
            userId={userId}
            bookingDate={bookingDate}
            isDialogOpen={isDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
