import { useFormContext } from "react-hook-form";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function FormAlert({ className }: { className?: string }) {
  const {
    formState: { errors, isSubmitSuccessful },
  } = useFormContext();

  if (errors.root) {
    return (
      <Alert
        variant="destructive"
        className={cn(
          "mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700",
          className
        )}
      >
        <AlertCircle />
        <div className="!pl-9">
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </div>
      </Alert>
    );
  }

  if (isSubmitSuccessful) {
    return (
      <Alert
        variant="default"
        className={cn(
          "mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700",
          className
        )}
      >
        <CheckCircle className="!text-green-600" />
        <div className="!pl-9">
          <AlertTitle>Successo</AlertTitle>
          <AlertDescription>
            Il form è stato inviato con successo.
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return null;
}
