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
import { useState } from "react";
import { DAYS_OF_WEEK_IN_ORDER, giorniSettimana } from "@/constants";
import { EventScheduleSchemaType, WeekDay } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { format, roundToNearestMinutes } from "date-fns";

type Props = {
  day: WeekDay;
};

export default function Schedule({ day }: Props) {
  const [isDayActive, setIsDayActive] = useState(false);

  const form = useFormContext<EventScheduleSchemaType>();

  const {
    fields: schedules,
    append,
    update,
    remove,
  } = useFieldArray({ name: day, control: form.control });

  const showSchedules = !!schedules.length && isDayActive;

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
      {showSchedules &&
        schedules.map((schedule, i) => (
          <div className="mt-4" key={schedule.id + i}>
            <FormField
              control={form.control}
              name={`${day}.${i}.startTime`}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
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
                </FormItem>
              )}
            />
          </div>
        ))}
      {showSchedules && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              append({
                startTime: format(
                  roundToNearestMinutes(new Date(), { nearestTo: 15 }),
                  "HH:mm"
                ),
                isActive: true,
              })
            }
          >
            Aggiungi orario
          </Button>
        </div>
      )}
    </div>
  );
}
