import SigninForm from "@/components/forms/SigninForm";
import Link from "next/link";

export const metadata = {
  title: "Accedi",
  description: "Accedi al tuo accaount tabata",
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Accedi al tuo account
      </h1>
      <SigninForm />
      <p className="mt-4 text-center text-sm">
        Non hai un account?{" "}
        <Link
          href="/sign-up"
          className="hover:underline text-primary"
        >
          Registrati
        </Link>
      </p>
    </div>
  );
}
