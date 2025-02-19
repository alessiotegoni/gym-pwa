import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Users,
  Calendar,
  BookOpen,
  LogOut,
  FolderTree,
  Dumbbell,
} from "lucide-react";
import SwitchThemeBtn from "../SwitchThemeBtn";
import { signOut } from "@/lib/auth";
import Link from "next/link";

export function AdminSidebar() {
  return (
    <Sidebar side="right" className="bg-white border-r border-gray-200">
      <SidebarHeader className="text-2xl m-2 mb-0 font-bold">
        Tabata panel
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/members"
                className="flex items-center !h-12 gap-2 rounded-lg transition-colors"
              >
                <Users className="!size-5" />
                <span className="text-base">Gestisci Membri</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/subscriptions"
                className="flex items-center !h-12 gap-2 rounded-lg transition-colors"
              >
                <FolderTree className="!size-5" />
                <span className="text-base">Gestisci Abbonamenti</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3" asChild>
              <Link
                href="/admin/events"
                className="flex items-center !h-12 gap-2 rounded-lg transition-colors"
              >
                <Calendar className="!size-5" />
                <span className="text-base">Gestisci Corsi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3" asChild>
              <Link
                href="/admin/bookings"
                className="flex items-center !h-12 gap-2 rounded-lg transition-colors"
              >
                <BookOpen className="!size-5" />
                <span className="text-base">Gestisci Prenotazioni</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-3" asChild>
              <Link
                href="/admin/trainings"
                className="flex items-center !h-12 gap-2 rounded-lg transition-colors"
              >
                <Dumbbell className="!size-5" />
                <span className="text-base">Gestisci Allenamenti</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SwitchThemeBtn />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form
              action={async () => {
                "use server";

                await signOut({ redirectTo: "/sign-in" });
              }}
            >
              <SidebarMenuButton
                className="flex items-center gap-2 bg-destructive
              rounded-lg text-base !h-12 font-semibold transition-colors text-white"
              >
                <LogOut className="!size-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
