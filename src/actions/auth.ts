"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { signIn } from "@/lib/auth";
import { signinSchema, signupSchema } from "@/lib/schema/auth";
import { SignupSchemaType } from "@/types";
import { hash } from "bcrypt";
import { redirect } from "next/navigation";

export async function signup(values: SignupSchemaType, isTrial: string | null) {
  const { success, data } = signupSchema.safeParse(values);

  if (!success) return { error: true };

  const emailExists = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: ({ email }, { eq }) => eq(email, data.email),
  });

  if (emailExists) return { error: true, message: "Email gia esistente" };

  const password = await hash(data.password, 12);

  const { rowCount } = await db.insert(users).values({ ...data, password });

  if (!rowCount) return { error: true };

  const searchParams = new URLSearchParams();
  if (isTrial) searchParams.set("redirectUrl", "/user/profile?trial=true");

  redirect(`/sign-in?${searchParams.toString()}`);
}

export const credentialsSignIn = async (values: {
  email: string;
  password: string;
}) => {
  const { error, data } = signinSchema.safeParse(values);

  if (error) return { error: true };

  try {
    await signIn("credentials", {
      ...data,
      redirect: false,
    });
  } catch (err) {
    return { error: true, message: "Credenziali errate" };
  }
};
