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
import { ChangeEvent, useEffect, useState } from "react";
import { DAYS_OF_WEEK_IN_ORDER, giorniSettimana } from "@/constants";
import { EventScheduleSchemaType, WeekDay } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import { getBookingTime } from "@/lib/utils";
import { isScheduleOperable } from "@/actions/schedules";
import { toast } from "sonner";
import Link from "next/link";
import SubmitBtn from "@/components/SubmitBtn";

type Props = {
  day: WeekDay;
  eventDuration: number;
};

const displayErrorToast = (isUpdating: boolean = true) => {
  toast.error(
    `Ci sono delle prenotazioni attive legate a questa programmazione,
        prima di ${
          isUpdating ? "modificarla" : "eliminarla"
        } elimina le prenotazioni`,
    {
      action: (
        <Button asChild>
          <Link href="/admin/bookings">Vai a prenotazioni</Link>
        </Button>
      ),
      duration: 10_000,
    }
  );
};

export default function Schedule({ day, eventDuration }: Props) {
  const [{ delitingScheduleId, isDeleting }, setDeletedSchedule] = useState<{
    delitingScheduleId: number | null;
    isDeleting: boolean;
  }>({
    delitingScheduleId: null,
    isDeleting: false,
  });

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
        isActive: isDayActive,
      }))
    );
  }, [isDayActive]);

  function handleAddTime() {
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
      scheduleId: null,
      startTime: format(startTime, "HH:mm"),
      endTime: format(addMinutes(startTime, eventDuration), "HH:mm"),
      isActive: true,
    });
  }

  async function handleRemoveTime(
    scheduleId: number | null,
    scheduleIndex: number
  ) {
    const isLast = !schedules.filter((s) => s.scheduleId !== scheduleId).length;

    if (!scheduleId) {
      remove(scheduleIndex);
      if (isLast) setIsDayActive(false);
      return;
    }

    setDeletedSchedule({ delitingScheduleId: scheduleId, isDeleting: true });
    const isDeletetable = await isScheduleOperable(scheduleId);

    if (isDeletetable) {
      remove(scheduleIndex);
      if (isLast) setIsDayActive(false);
    } else {
      displayErrorToast(false);
    }

    setDeletedSchedule({ delitingScheduleId: scheduleId, isDeleting: false });
  }

  return (
    <div className="rounded-xl p-4 border border-zinc-700/40 bg-zinc-900">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-lg capitalize">
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
                          className="bg-zinc-950"
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
                        <Input
                          className="bg-zinc-950"
                          type="time"
                          value={field.value}
                          disabled
                        />
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
                    <FormItem className="flex items-center gap-3 bg-secondary rounded-xl h-9 px-3 border borde-secondary">
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
                <SubmitBtn
                  type="button"
                  className="rounded-xl w-fit"
                  variant="destructive"
                  isLoading={
                    delitingScheduleId === schedule.scheduleId && isDeleting
                  }
                  onClick={() => handleRemoveTime(schedule.scheduleId, i)}
                >
                  <Trash2 />
                  Elimina
                </SubmitBtn>
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
