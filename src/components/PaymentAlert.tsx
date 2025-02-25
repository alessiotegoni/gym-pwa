"use client";

import type React from "react";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertProps {
  type: "success" | "error" | "neutral";
  title: string;
  message: string;
  onAction?: () => void;
  actionText?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onAction,
  actionText,
}) => {
  const colors = {
    success:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700",
    neutral:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
  };

  const iconColors = {
    success: "text-green-400 dark:text-green-300",
    error: "text-red-400 dark:text-red-300",
    neutral: "text-blue-400 dark:text-blue-300",
  };

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? XCircle
      : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${colors[type]} p-4 mb-4`}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${iconColors[type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          <h3
            className={`text-sm font-medium ${
              type === "success"
                ? "text-green-800 dark:text-green-200"
                : type === "error"
                ? "text-red-800 dark:text-red-200"
                : "text-blue-800 dark:text-blue-200"
            }`}
          >
            {title}
          </h3>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <p>{message}</p>
          </div>
          {onAction && actionText && (
            <div className="mt-4">
              <Button
                onClick={onAction}
                variant="outline"
                size="sm"
                className={
                  type === "success"
                    ? "text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-800/30"
                    : type === "error"
                    ? "text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-800/30"
                    : "text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-800/30"
                }
              >
                {actionText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

type Props = {
  success?: boolean;
  failed?: boolean;
};

export default function PaymentAlert({ success, failed }: Props) {
  return (
    <div className="space-y-4">
      {success && (
        <Alert
          type="success"
          title="Pagamento riuscito"
          message="Il tuo pagamento è stato elaborato con successo. Grazie per il tuo acquisto!"
        />
      )}
      {failed && (
        <Alert
          type="error"
          title="Pagamento fallito"
          message="Si è verificato un errore durante l'elaborazione del pagamento. Per favore, riprova o contatta il supporto."
        />
      )}
    </div>
  );
}
