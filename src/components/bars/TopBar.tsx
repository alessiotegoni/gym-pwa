import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { auth } from "@/lib/auth";
import Image from "next/image";

export default async function TopBar() {
  const session = await auth();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between
    px-4 py-2 bg-primary text-black h-14 rounded-bl-xl rounded-br-xl"
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
      {session?.isAdmin && (
        <>
          <SidebarTrigger />
          <AdminSidebar />
        </>
      )}
    </header>
  );
}
