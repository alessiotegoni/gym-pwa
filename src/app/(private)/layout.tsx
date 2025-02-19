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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className="grid grid-rows-[auto_1fr_auto] h-dvh">
        <TopBar />
        <main className={`container p-4 ${inter.variable} antialiased font-inter`}>
          {children}
        </main>
        <BottomBar />
      </SidebarProvider>
    </ThemeProvider>
  );
}
