import SignupForm from "@/components/forms/SignupForm";
import { TRIAL_DAYS } from "@/constants";
import Link from "next/link";

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
      <SignupForm />
      <p className="mt-4 text-center text-sm dark:text-slate-300">
        Hai gia un account?{" "}
        <Link
          href="/sign-in"
          className="text-yellow-600 dark:text-yellow-500 hover:underline"
        >
          Accedi
        </Link>
      </p>
    </div>
  );
}
