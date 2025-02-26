"use client";

import Link from "next/link";
import { Home, Calendar, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatedBackground } from "../ui/animated-background";

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
      <AnimatedBackground
        defaultValue={LINKS.find((link) => link.href === pathname)?.label}
        className="rounded-xl bg-background"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
      >
        {LINKS.map(({ icon: Icon, href, label }) => (
          <Link
            key={href}
            href={href}
            data-id={label}
            className="py-2 px-4 rounded-xl my-2 group"
          >
            <div className="flex flex-col items-center z-10">
              <Icon
                size={24}
                className="transition-colors group-data-[checked=true]:text-white"
              />
              <span className="text-[13px] mt-0.5 font-semibold transition-colors group-data-[checked=true]:text-white">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </AnimatedBackground>
    </nav>
  );
}
