import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle/db";
import { signinSchema } from "./schema/auth";
import { compare } from "bcrypt";
import { ADMINS_EMAILS } from "@/constants";
import { getUser } from "./queries";
import type { User } from "next-auth";

export const adapter = DrizzleAdapter(db);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { success, data } = signinSchema.safeParse(credentials);

        if (!success) return null;

        const user = await getUser({ userEmail: data.email });

        if (!user) return null;

        const isMatch = await compare(data.password, user.password);

        if (!isMatch) return null;

        return {
          id: user.id.toString(),
          name: user.firstName,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (!token.sub) return session;

      return {
        ...session,
        userId: parseInt(token.sub),
        isAdmin: ADMINS_EMAILS.includes(session.user.email),
      };
    },
  },
});
