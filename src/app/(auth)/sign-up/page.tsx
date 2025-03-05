import SignupForm from "@/components/forms/SignupForm";
import { TRIAL_DAYS } from "@/constants";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Iscriviti",
  description: `Iscriviti a tabata e ricevi una prova gratuita di ${TRIAL_DAYS} giorni`,
};

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Crea il tuo account
      </h1>
      <Suspense>
        <SignupForm />
      </Suspense>
      <p className="mt-4 text-center text-sm dark:text-slate-300">
        Hai gia un account?{" "}
        <Link href="/sign-in" className="hover:underline text-primary">
          Accedi
        </Link>
      </p>
    </div>
  );
}
