import { Dumbbell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { auth } from "@/lib/auth";

export default async function TopBar() {
  const session = await auth();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between
    px-4 py-2 bg-yellow-400 text-black min-h-12"
    >
      <div className="flex items-center space-x-2">
        <Dumbbell size={25} />
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
