import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { auth } from "@/lib/auth";
import Image from "next/image";
import PushNotificationHandler from "../PushNotificationHandler";
import BottomBar from "./BottomBar";

export default async function TopBar() {
  const session = await auth();

  if (!session?.userId) return;

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between
    px-4 py-2 bg-primary text-black h-14 rounded-bl-xl rounded-br-xl
    xl:w-[1100px] xl:mx-auto"
    >
      <div className="flex items-center gap-2">
        <Image
          src="https://cyan-tropical-guanaco-792.mypinata.cloud/ipfs/bafkreidzwpent6mq2wm7yxu3mfmvwmwn5w3xxurj7dbakauepflhjsyvca"
          alt="Tabata addicted"
          width={50}
          height={50}
        />

        <span className="font-bold text-xl">Tabata</span>
      </div>

      <BottomBar
        classNames={{
          nav: "hidden md:flex static px-0",
          link: "my-0 py-1.5 px-3",
          label: "text-sm mt-0",
        }}
        showIcons={false}
      />
      <div className="flex justify-center items-center gap-3">
        <PushNotificationHandler />
        {session?.isAdmin && (
          <div className="md:hidden">
            <SidebarTrigger />
            <AdminSidebar />
          </div>
        )}
      </div>
    </header>
  );
}
