"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, LoaderCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookedUsers } from "@/actions/bookings";
import { Training, User } from "@/types";
import SubmitBtn from "./SubmitBtn";
import { TransitionPanel } from "./ui/transition-panel";
import { formatDate } from "@/lib/utils";
import { format } from "date-fns";
import TrainingImg from "./TrainingImg";
import { getTraining } from "@/actions/dailyTrainings";
import { it } from "date-fns/locale";

type Props = {
  scheduleId: number;
  userId: number;
  bookingDate: Date;
  usersCount: number;
  eventCapacity: number;
};

const ITEMS = [
  {
    title: "Utenti prenotati",
    content: BookedUsers,
  },
  {
    title: "Allenamento",
    content: TrainingInfo,
  },
];

export default function BookingDetails({
  scheduleId,
  userId,
  bookingDate,
  usersCount,
  eventCapacity,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Badge variant="secondary" className="flex items-center">
        <Users className="size-4 mr-1" />
        {usersCount}/{eventCapacity}
      </Badge>
      <Dialog onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Info />
            Dettagli
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="mb-1">
              Dettagli dell'allenamento
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-4 flex justify-center gap-2">
              {ITEMS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-md px-3 py-1 text-sm font-medium ${
                    activeIndex === index
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700">
              <TransitionPanel
                activeIndex={activeIndex}
                // transition={{ duration: 0.2, ease: "easeInOut" }}
                // variants={{
                //   enter: { opacity: 0, y: -50, filter: "blur(4px)" },
                //   center: { opacity: 1, y: 0, filter: "blur(0px)" },
                //   exit: { opacity: 0, y: 50, filter: "blur(4px)" },
                // }}
              >
                {ITEMS.map(({ content: Tab }, index) => (
                  <Tab
                    key={index}
                    scheduleId={scheduleId}
                    userId={userId}
                    bookingDate={bookingDate}
                    activeIndex={activeIndex}
                    isDialogOpen={isDialogOpen}
                  />
                ))}
              </TransitionPanel>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type TabProps = Pick<Props, "scheduleId" | "bookingDate" | "userId"> & {
  isDialogOpen: boolean;
  activeIndex: number;
};

function BookedUsers({
  scheduleId,
  userId,
  bookingDate,
  activeIndex,
  isDialogOpen,
}: TabProps) {
  const [users, setUsers] = useState<
    Pick<User, "firstName" | "lastName" | "image" | "id">[] | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const handleSetUsers = async () => {
    const results = await getBookedUsers(scheduleId, bookingDate);
    setUsers(results);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isDialogOpen || activeIndex !== 0) return;

    if (!users?.length) setIsLoading(true);
    handleSetUsers();
  }, [isDialogOpen]);

  return (
    <>
      {isLoading ? (
        <div className="grid place-content-center min-h-[270px]">
          <LoaderCircle size={40} className="animate-spin" />
        </div>
      ) : (
        <section>
          {users?.length ? (
            <>
              <p className="mt-4 font-medium text-center mb-6">
                Lista degli utenti prenotati per questa sessione.
              </p>
              <ScrollArea className="h-[270px] pr-4 mb-6">
                <ul className="flex flex-wrap gap-y-4 mt-4">
                  {users.map((user, i) => (
                    <li
                      key={i}
                      className="flex flex-col items-center gap-3 basis-1/3"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.image || undefined}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName[0].toUpperCase()}
                          {user.lastName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-center text-sm">
                        {user.id === userId
                          ? "Tu"
                          : `${user.firstName} ${user.lastName}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </>
          ) : (
            <p className="min-h-[270px] mt-4 font-medium text-center">
              Non ci sono utenti prenotati per questa sessione
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
          handleSetUsers();
        }}
      />
    </>
  );
}

function TrainingInfo({ bookingDate, isDialogOpen, activeIndex }: TabProps) {
  const [training, setTraining] = useState<Training | undefined>();

  const [isLoading, setIsLoading] = useState(false);

  const handleSetTraining = async () => {
    const result = await getTraining({ date: formatDate(bookingDate) });
    setTraining(result);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isDialogOpen || activeIndex !== 1) return;

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
