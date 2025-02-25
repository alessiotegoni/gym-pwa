import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "@/components/bars/TopBar";
import BottomBar from "@/components/bars/BottomBar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <main
        className={`container relative p-4 ${inter.variable} antialiased font-inter`}
      >
        {children}
      </main>
      <BottomBar />
    </>
  );
}
