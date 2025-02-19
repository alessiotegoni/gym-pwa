import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t pt-8 pb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Tabata Gym</h5>
            <p className="text-sm dark:text-slate-300">
              Il tuo partner per una vita sana e attiva.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Link Rapidi</h5>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  href="/about"
                  className="hover:text-yellow-600 dark:hover:text-yellow-500 dark:text-slate-300"
                >
                  Chi Siamo
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/classes"
                  className="hover:text-yellow-600 dark:hover:text-yellow-500 dark:text-slate-300"
                >
                  Classi
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/pricing"
                  className="hover:text-yellow-600 dark:hover:text-yellow-500 dark:text-slate-300"
                >
                  Prezzi
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/contact"
                  className="hover:text-yellow-600 dark:hover:text-yellow-500 dark:text-slate-300"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h5 className="text-lg font-semibold mb-2">Seguici</h5>
            <div className="flex space-x-4">
              <a
                href="#"
                className="dark:text-slate-300 dark:hover:text-yellow-500 hover:text-yellow-600"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="dark:text-slate-300 dark:hover:text-yellow-500 hover:text-yellow-600"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="dark:text-slate-300 dark:hover:text-yellow-500 hover:text-yellow-600"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} Tabata. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
