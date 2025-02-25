"use client";

import * as React from "react";
import { addDays, formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Subscription } from "@/types";
import SubmitBtn from "./SubmitBtn";
import { extendSubscription } from "@/actions/subscriptions";
import { toast } from "sonner";

export default function ExtendSubDatePicker({
  subscription,
}: {
  subscription: Subscription;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  async function handleClick() {
    if (!date) return;

    setIsLoading(true);

    const res = await extendSubscription(
      subscription.id,
      subscription.endDate,
      date,
      subscription.stripeSubscriptionId
    );

    if (res?.error) {
      toast.error("Errore nell'estendere l'abbonamento, riprovare piu tardi");
    } else {
      toast.success(
        `Data dell'abbonamento estesa fino al ${date.toLocaleString()}`
      );
    }

    setIsLoading(false);
    if (!res?.error) setDate(undefined);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "!mt-0 justify-start text-left font-normal basis-1/2 grow"
          )}
        >
          <CalendarIcon />
          {date ? (
            formatDate(date, "dd MMMM yyyy")
          ) : (
            <span>Estendi durata</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date || addDays(subscription.endDate, 1)}
          onSelect={setDate}
          initialFocus
          disabled={(day) => day <= subscription.endDate}
        />

        <div className="p-3">
          <SubmitBtn
            label="Estendi durata"
            loadingLabel="Estendendo"
            className="w-full"
            disabled={!date}
            isLoading={isLoading}
            onClick={handleClick}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
Popover;
