import Link from "next/link";
import { Dumbbell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import SwitchThemeBtn from "./SwitchThemeBtn";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Classi" },
  { href: "/pricing", label: "Prezzi" },
  { href: "/contact", label: "Contatti" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Dumbbell className="!size-5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-xl font-bold">Tabata Gym</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-yellow-600 dark:text-slate-300 dark:hover:text-yellow-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <div className="flex gap-3">
              <SwitchThemeBtn className="mr-2" />
              <Button
                asChild
                className="hidden md:block font-semibold bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600"
              >
                <Link href="/sign-up?trial=true">Prova Gratuita</Link>
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="!size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <SheetClose key={item.label} asChild>
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-lg font-medium dark:text-slate-300 dark:hover:text-yellow-500"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <SheetClose
                    asChild
                    className="bg-yellow-600 font-semibold dark:bg-yellow-500 dark:hover:bg-yellow-600"
                  >
                    <Button asChild>
                      <Link href="/sign-up?trial=true">Prova Gratuita</Link>
                    </Button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
