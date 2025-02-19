"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditUserSchemaType, User } from "@/types";
import { editUserSchema } from "@/lib/schema/user";
import { toast } from "@/hooks/use-toast";
import ImgFormField from "../ImgFormField";
import SubmitBtn from "../SubmitBtn";
import { updateUserProfile } from "@/actions/user";

type Props = {
  user: User;
};

export function UserProfileForm({
  user: { firstName, lastName, image },
}: Props) {

  const form = useForm<EditUserSchemaType>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      img: image ?? undefined,
    },
  });

  async function onSubmit(data: EditUserSchemaType) {
    const res = await updateUserProfile(data);

    if (res.error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante l'aggiornamento del profilo. Riprova più tardi.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profilo aggiornato",
      description: "Le tue informazioni sono state aggiornate con successo.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Il tuo nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cognome</FormLabel>
              <FormControl>
                <Input placeholder="Il tuo cognome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImgFormField />
        <SubmitBtn label="Aggiorna profilo" loadingLabel="Aggiornando" />
      </form>
    </Form>
  );
}
