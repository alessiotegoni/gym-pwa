"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDays, format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { createSubscriptionSchema } from "@/lib/schema/subscription";
import SubmitBtn from "../SubmitBtn";
import { CreateSubscriptionType, Users } from "@/types";
import { adminCreateSubscription } from "@/actions/subscriptions";
import { SUBSCRIPTIONS_PLANS } from "@/constants";

type Props = {
  users: Pick<Users, "id" | "email">[];
};

export default function SubscriptionCreateForm({ users }: Props) {
  const form = useForm<CreateSubscriptionType>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      isTrial: false,
      endDate: addDays(new Date(), SUBSCRIPTIONS_PLANS[0].duration),
    },
  });

  async function onSubmit(values: CreateSubscriptionType) {
    if (form.formState.isSubmitting) return;

    const result = await adminCreateSubscription(values);

    if (result?.error)
      form.setError("root", {
        message: "Errore nella creazione dell'abbonamento",
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Utente</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find(
                            (user) => user.id.toString() === field.value
                          )?.email
                        : "Seleziona un utente"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Cerca un utente..." />
                    <CommandList>
                      <CommandEmpty>Nessun utente trovato.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.id.toString()}
                            key={user.id}
                            onSelect={field.onChange}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                user.id.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Seleziona l'utente per cui creare l'abbonamento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isTrial"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Periodo di prova</FormLabel>
                <FormDescription>
                  Attiva se questo è un abbonamento di prova.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data di fine</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: it })
                      ) : (
                        <span>Seleziona una data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Seleziona la data di fine dell'abbonamento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitBtn label="Crea Abbonamento" loadingLabel="Creazione in corso" />
      </form>
    </Form>
  );
}
