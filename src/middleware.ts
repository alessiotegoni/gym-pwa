import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { ADMINS_EMAILS } from "./constants";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/"];

const { auth } = NextAuth({ providers: [] });

export default auth(({ auth, nextUrl }) => {
  if (!PUBLIC_ROUTES.includes(nextUrl.pathname) && !auth?.user)
    return NextResponse.redirect(new URL("/", nextUrl));

  if (PUBLIC_ROUTES.includes(nextUrl.pathname) && auth?.user)
    return NextResponse.redirect(new URL("/user", nextUrl));

  if (
    nextUrl.pathname.startsWith("/admin") &&
    !ADMINS_EMAILS.includes(auth?.user?.email!)
  )
    return NextResponse.redirect(new URL("/user", nextUrl));
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|public/|favicon.ico|sw.js|manifest.webmanifest).*)",
  ],
};
