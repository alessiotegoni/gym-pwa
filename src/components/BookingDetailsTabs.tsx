import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsProps } from "./BookingDetails";
import BookedUsers from "./BookedUsers";
import TrainingInfo from "./TrainingInfo";

export type TabsProps = Pick<
  BookingDetailsProps,
  "scheduleId" | "userId" | "bookingDate"
> & { isDialogOpen: boolean };

export default function BookingDetailsTabs({
  scheduleId,
  userId,
  bookingDate,
  isDialogOpen,
}: TabsProps) {
  return (
    <Tabs defaultValue="tab-1" className="items-center">
      <TabsList className="bg-transparent">
        <TabsTrigger
          value="tab-1"
          className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-lg"
        >
          Utenti prenotati
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-lg"
        >
          Allenamento
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1" className="w-full">
        <BookedUsers
          scheduleId={scheduleId}
          userId={userId}
          bookingDate={bookingDate}
          isDialogOpen={isDialogOpen}
        />
      </TabsContent>
      <TabsContent value="tab-2" className="w-full">
        <TrainingInfo bookingDate={bookingDate} isDialogOpen={isDialogOpen} />
      </TabsContent>
    </Tabs>
  );
}
