import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="container p-0">{children}</main>
      <Footer />
    </>
  );
}
