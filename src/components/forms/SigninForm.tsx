"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/lib/schema/auth";
import SubmitBtn from "../SubmitBtn";
import { useRouter, useSearchParams } from "next/navigation";
import { credentialsSignIn } from "@/actions/auth";
import FormAlert from "../FormAlert";

export default function SigninForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    if (form.formState.isSubmitSuccessful) return;

    const res = await credentialsSignIn(values);

    if (res?.error) {
      form.setError("root", {
        message:
          res?.message || "Errore nella registrazione, riprovare piu tardi",
      });
      return;
    }

    router.push(searchParams.get("redirectUrl") || "/user");
  }

  return (
    <Form {...form}>
      <FormAlert />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitBtn
          label="Accedi"
          loadingLabel="Accesso in corso"
          className="!mt-5"
        />
      </form>
    </Form>
  );
}
