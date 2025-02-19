"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DAYS_OF_WEEK_IN_ORDER, giorniSettimana } from "@/constants";
import { EventScheduleSchemaType, WeekDay } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";

type Props = {
  day: WeekDay;
  eventDuration: number;
};

export default function Schedule({ day, eventDuration }: Props) {
  const form = useFormContext<EventScheduleSchemaType>();
  const {
    fields: schedules,
    append,
    remove,
  } = useFieldArray({ name: day, control: form.control });

  const [isDayActive, setIsDayActive] = useState(
    schedules.some((schedule) => schedule.isActive)
  );

  // FIXME: utilizzare le schedules dal db al posto che quelle di fieldArray

  useEffect(() => {
    form.setValue(
      day,
      schedules.map(({ startTime, endTime, isActive }) => ({
        startTime,
        endTime,
        isActive: !isDayActive ? false : isActive,
      }))
    );
  }, [isDayActive]);

  const handleAddTime = () => {
    const startTime = roundToNearestMinutes(new Date(), {
      nearestTo: 30,
    });

    append({
      startTime: format(startTime, "HH:mm"),
      endTime: format(addMinutes(startTime, eventDuration), "HH:mm"),
      isActive: true,
    });
  };

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <h3 className="font-semibold capitalize">
            {giorniSettimana[DAYS_OF_WEEK_IN_ORDER.indexOf(day)]}
          </h3>
          <p className="text-[0.8rem] text-muted-foreground">
            Attiva o disattiva questo giorno
          </p>
        </div>
        <Switch checked={isDayActive} onCheckedChange={setIsDayActive} />
      </div>
      {!!schedules.length && isDayActive && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {schedules.map((schedule, i) => (
            <div key={schedule.id}>
              <FormField
                control={form.control}
                name={`${day}.${i}.startTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name={`${day}.${i}.isActive`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(i)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isDayActive && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleAddTime}
          >
            Aggiungi orario
          </Button>
        </div>
      )}
    </div>
  );
}
