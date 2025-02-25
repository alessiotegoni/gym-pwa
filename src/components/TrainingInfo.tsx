import { getTraining } from "@/actions/dailyTrainings";
import { formatDate } from "@/lib/utils";
import { Training } from "@/types";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import TrainingImg from "./TrainingImg";
import SubmitBtn from "./SubmitBtn";
import { TabsProps } from "./BookingDetailsTabs";

type Props = Pick<TabsProps, "bookingDate" | "isDialogOpen">;

export default function TrainingInfo({ bookingDate, isDialogOpen }: Props) {
  const [training, setTraining] = useState<Training | undefined>();

  const [isLoading, setIsLoading] = useState(false);

  const handleSetTraining = async () => {
    const result = await getTraining({ date: formatDate(bookingDate) });
    setTraining(result);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isDialogOpen) return;

    if (!training) setIsLoading(true);
    handleSetTraining();
  }, [isDialogOpen]);

  return (
    <>
      {isLoading ? (
        <div className="grid place-content-center min-h-[270px]">
          <LoaderCircle size={40} className="animate-spin" />
        </div>
      ) : (
        <section>
          {training ? (
            <>
              <p className="mt-4 font-medium text-center">
                Allenamento del {format(bookingDate, "dd MMMM", { locale: it })}
              </p>
              <TrainingImg {...training} />
              {training.description && (
                <p className="font-semibold mb-6">{training.description}</p>
              )}
            </>
          ) : (
            <p className="min-h-[270px] mt-4 font-medium text-center">
              L'allenamento non e' ancora stato caricato
            </p>
          )}
        </section>
      )}
      <SubmitBtn
        label="Aggiorna"
        loadingLabel="Aggiornando"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          handleSetTraining();
        }}
      />
    </>
  );
}
