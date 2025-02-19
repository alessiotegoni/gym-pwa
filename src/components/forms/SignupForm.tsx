"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import SubmitBtn from "../SubmitBtn";
import { signupSchema } from "@/lib/schema/auth";
import { signup } from "@/actions/auth";
import FormAlert from "../FormAlert";
import { useSearchParams } from "next/navigation";
import { SignupSchemaType } from "@/types";

export default function SignupForm() {
  const searchParams = useSearchParams();

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupSchemaType) {
    const { error, message } = await signup(values, searchParams.get("trial"));

    if (error)
      form.setError("root", {
        message: message || "Errore nella registrazione, riprovare piu tardi",
      });
  }

  return (
    <Form {...form}>
      <FormAlert />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Mario" {...field} />
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
                <Input placeholder="Rossi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="mario.rossi@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="text" placeholder="********" {...field} />
              </FormControl>
              {!fieldState.error && (
                <FormDescription>
                  La password deve essere di almeno 8 caratteri.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitBtn
          label="Crea account"
          loadingLabel="Creazione account"
          className="!mt-5"
        />
      </form>
    </Form>
  );
}
