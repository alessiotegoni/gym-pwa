"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { getBookingTime } from "@/lib/utils";

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

  useEffect(() => {
    form.setValue(
      day,
      schedules.map(({ isActive, ...schedule }) => ({
        ...schedule,
        isActive: !isDayActive ? false : isActive,
      }))
    );
  }, [isDayActive]);

  const handleAddTime = () => {
    const lastSchedule = schedules.at(-1);

    const lastStartTime = lastSchedule
      ? getBookingTime(lastSchedule.startTime)
      : new Date();

    const startTime = roundToNearestMinutes(
      lastStartTime ? addMinutes(lastStartTime, eventDuration) : lastStartTime,
      {
        nearestTo: 30,
      }
    );

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
        <div className="my-4">
          {schedules.map((schedule, i) => (
            <div key={schedule.id}>
              <div className="grid grid-cols-2 gap-3 my-4">
                <FormField
                  control={form.control}
                  name={`${day}.${i}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue(
                              `${day}.${i}.endTime`,
                              format(
                                addMinutes(
                                  getBookingTime(e.target.value),
                                  eventDuration
                                ),
                                "HH:mm"
                              )
                            );
                          }}
                        />
                      </FormControl>
                      <FormDescription>Orario di inizio</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${day}.${i}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" value={field.value} disabled />
                      </FormControl>
                      <FormDescription>Orario di fine</FormDescription>
                    </FormItem>
                  )}
                />
                {form.formState.errors[day] && (
                  <p className="text-sm text-destructive col-span-2">
                    {form.formState.errors[day][i]?.startTime?.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name={`${day}.${i}.isActive`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 bg-secondary rounded-lg h-9 px-3 border borde-secondary">
                      <FormLabel>
                        {field.value ? "Disattiva" : "Attiva"} orario
                      </FormLabel>
                      <FormControl>
                        <Switch
                          className="!mt-0"
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
                  onClick={() => remove(i)}
                >
                  <Trash2 />
                  Elimina
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
