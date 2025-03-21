"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditUserSchemaType, User } from "@/types";
import { editUserSchema } from "@/lib/schema/user";
import { toast } from "sonner";
import ImgFormField from "../ImgFormField";
import SubmitBtn from "../SubmitBtn";
import { updateUserProfile } from "@/actions/users";
import BtnFixedContainer from "../BtnFixedContainer";
import { useRouter } from "next/navigation";
import { prepareImageForUpload } from "@/actions/images";

type Props = {
  user: User;
};

export function UserProfileForm({
  user: { firstName, lastName, image },
}: Props) {
  const form = useForm<EditUserSchemaType>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName,
      lastName,
      img: image ?? undefined,
    },
  });

  const router = useRouter();

  async function onSubmit(data: EditUserSchemaType) {
    try {
      let optimizedData = { ...data };

      if (data.img instanceof File) {
        try {
          optimizedData.img = await prepareImageForUpload(data.img, 800, 0.8);
        } catch (error) {
          console.error(
            "Errore durante l'ottimizzazione dell'immagine:",
            error
          );
        }
      }

      const res = await updateUserProfile(optimizedData);

      if (res?.error) {
        toast.error(
          "Si è verificato un errore durante l'aggiornamento del profilo. Riprova più tardi."
        );
        return;
      }

      toast.success("Le tue informazioni sono state aggiornate con successo.");
      router.back();
    } catch (error) {
      console.error("Errore durante l'aggiornamento del profilo:", error);
      toast.error("Si è verificato un errore imprevisto. Riprova più tardi.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col gap-3"
      >
        <div className="space-y-3 grow">
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
          <ImgFormField
            alt={`${form.getValues("firstName")} ${form.getValues("lastName")}`}
          />
        </div>
        <BtnFixedContainer className="bottom-[93px] md:bottom-3">
          <SubmitBtn label="Aggiorna profilo" loadingLabel="Aggiornando" />
        </BtnFixedContainer>
      </form>
    </Form>
  );
}
