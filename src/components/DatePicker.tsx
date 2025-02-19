"use client";

import * as React from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import ResetFilterBtn from "./ResetFilterBtn";

type Props = {
  className?: string;
  selectedDate?: string;
};

export function DatePicker({ className, selectedDate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    const params = new URLSearchParams(searchParams);
    if (newDate) {
      params.set("date", format(newDate, "yyyy-MM-dd"));
    } else {
      params.delete("date");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "d MMMM yyyy", { locale: it })
            ) : (
              <span>Seleziona una data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            locale={it}
          />
        </PopoverContent>
      </Popover>
      <ResetFilterBtn
        paramName="date"
        input={date}
        onReset={() => setDate(undefined)}
      />
    </div>
  );
}
