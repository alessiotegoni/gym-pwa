import Link from "next/link";
import { Dumbbell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
              <Dumbbell className="!size-5 dark:text-primary" />
              <span className="text-xl font-bold">Tabata</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:bg-primary dark:hover:text-black rounded-lg p-1 px-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <div className="flex gap-3">
              <Button asChild className="hidden md:block">
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

                  <SheetClose asChild>
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
