"use client";

import Link from "next/link";
import { Home, Calendar, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { icon: Home, href: "/user", label: "Home" },
  { icon: Calendar, href: "/schedule", label: "Palinsesto" },
  { icon: User, href: "/user/profile", label: "Profilo" },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 flex justify-around items-center
    px-4 bg-primary *:dark:text-black rounded-tr-xl rounded-tl-xl"
    >
      {LINKS.map(({ icon: Icon, href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex flex-col items-center py-1.5 px-4 rounded-xl my-2",
            pathname === href && "bg-primary-foreground"
          )}
        >
          <Icon size={24} />
          <span className="text-[13px] mt-0.5 font-semibold">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
