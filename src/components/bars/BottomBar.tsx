"use client";

import Link from "next/link";
import { Home, Calendar, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatedBackground } from "../ui/animated-background";
import { BOTTOM_BAR_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

type Props = {
  classNames?: {
    nav?: string;
    link?: string;
    label?: string;
  };
  showIcons?: boolean;
};

export default function BottomBar({ classNames, showIcons = true }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        `sticky bottom-0 flex justify-around items-center
    px-4 bg-primary *:dark:text-black rounded-tr-xl rounded-tl-xl md:hidden`,
        classNames?.nav
      )}
    >
      <AnimatedBackground
        defaultValue={
          BOTTOM_BAR_LINKS.find((link) => link.href === pathname)?.label
        }
        className="rounded-xl bg-background"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
      >
        {BOTTOM_BAR_LINKS.map(({ icon: Icon, href, label }) => (
          <Link
            key={href}
            href={href}
            data-id={label}
            className={cn("py-2 px-4 rounded-xl my-2 group", classNames?.link)}
          >
            <div className="flex flex-col items-center z-10">
              {showIcons && (
                <Icon
                  size={24}
                  className="transition-colors group-data-[checked=true]:text-white"
                />
              )}
              <span
                className={cn(
                  "text-[13px] mt-0.5 font-semibold transition-colors group-data-[checked=true]:text-white",
                  classNames?.label
                )}
              >
                {label}
              </span>
            </div>
          </Link>
        ))}
      </AnimatedBackground>
    </nav>
  );
}
