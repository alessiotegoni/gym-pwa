"use client";

import { Info, LoaderCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookedUsers } from "@/actions/bookings";
import { Training, User } from "@/types";
import SubmitBtn from "./SubmitBtn";
import MorphingDialogBasicImage from "./MorphingDialogBasicImage";
import { ScrollArea } from "./ui/scroll-area";
import { TabsProps } from "./BookingDetailsTabs";

type TabProps = Pick<
  TabsProps,
  "scheduleId" | "userId" | "bookingDate" | "isDialogOpen"
>;

export default function BookedUsers({
  scheduleId,
  userId,
  bookingDate,
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
    if (!isDialogOpen) return;

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
                  {users.map((user, i) => {
                    const fullName = `${user.firstName} ${user.lastName}`;

                    return (
                      <li
                        key={i}
                        className="flex flex-col items-center gap-3 basis-1/3"
                      >
                        {user.image ? (
                            <MorphingDialogBasicImage
                              src={user.image}
                              alt={fullName}
                              className="size-14 rounded-full"
                            />
                        ) : (
                          <div className="size-14 grid place-content-center rounded-full
                          bg-zinc-900">
                            {user.firstName.charAt(0).toUpperCase()}
                            {user.lastName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-center text-sm">
                          {user.id === userId ? "Tu" : fullName}
                        </span>
                      </li>
                    );
                  })}
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
