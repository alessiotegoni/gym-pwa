import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { ADMINS_EMAILS } from "./constants";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PUBLIC_ROUTES = [...AUTH_ROUTES, "/"];

const { auth } = NextAuth({ providers: [] });

export default auth(({ auth, nextUrl }) => {
  if (nextUrl.pathname === "/" && auth?.user)
    return NextResponse.redirect(new URL("/user", nextUrl));

  if (AUTH_ROUTES.includes(nextUrl.pathname) && auth?.user)
    return NextResponse.redirect(new URL("/user", nextUrl));

  if (!PUBLIC_ROUTES.includes(nextUrl.pathname) && !auth?.user)
    return NextResponse.redirect(new URL("/sign-in", nextUrl));

  if (
    nextUrl.pathname.startsWith("/admin") &&
    !auth?.user &&
    !ADMINS_EMAILS.includes(auth?.user?.email!)
  )
    return NextResponse.redirect(new URL("/", nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
