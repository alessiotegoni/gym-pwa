import { Inter } from "next/font/google";
import TopBar from "@/components/bars/TopBar";
import BottomBar from "@/components/bars/BottomBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_auto]">
      <TopBar />
      <main
        className={`container py-4 ${inter.variable} antialiased font-inter`}
      >
        {children}
      </main>
      <BottomBar
        classNames={{
          nav: "standalone:my-0 standalone:h-[90px] standalone:items-start",
        }}
      />
    </div>
  );
}
