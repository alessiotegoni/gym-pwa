"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Users,
  Calendar,
  BookOpen,
  LogOut,
  FolderTree,
  Dumbbell,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

const LINKS = [
  { icon: Users, href: "/admin/members", label: "Gestisci Membri" },
  {
    icon: FolderTree,
    href: "/admin/subscriptions",
    label: "Gestisci Abbonamenti",
  },
  { icon: Calendar, href: "/admin/events", label: "Gestisci Corsi" },
  { icon: BookOpen, href: "/admin/bookings", label: "Gestisci Prenotazioni" },
  { icon: Dumbbell, href: "/admin/trainings", label: "Gestisci Allenamenti" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar side="right" className="bg-white border-r border-gray-200">
      <SidebarHeader
        className="text-2xl m-2 mb-0 font-bold flex-row items-center
      bg-zinc-950 rounded-xl p-4 border border-zinc-700/30"
      >
        <Image
          src="https://cyan-tropical-guanaco-792.mypinata.cloud/ipfs/bafkreidzwpent6mq2wm7yxu3mfmvwmwn5w3xxurj7dbakauepflhjsyvca"
          alt="Tabata addicted"
          width={50}
          height={45}
        />
        <h1 className="font-semibold">Dashboard</h1>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {LINKS.map(({ icon: Icon, href, label }) => {
            const isActive = pathname === href;

            return (
              <SidebarMenuItem key={href} onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2 !h-10 px-3 rounded-lg transition-colors",
                      isActive && "bg-primary *:text-black"
                    )}
                  >
                    <Icon className="!size-5" />
                    <span
                      className={cn("font-medium", isActive && "font-semibold")}
                    >
                      {label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form
              className="standalone:mb-2"
              action={async () => {
                toast.loading("Disconnessione...");
                await signOut({ redirectTo: "/sign-in" });
              }}
            >
              <SidebarMenuButton asChild>
                <Button
                  variant="destructive"
                  className="!h-10 justify-start rounded-lg"
                >
                  <LogOut className="!size-5" />
                  <span>Logout</span>
                </Button>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
