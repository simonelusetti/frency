import type { Metadata } from "next";

import "@/app/globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Frency",
  description: "Local football scouting MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto min-h-[calc(100vh-88px)] w-full max-w-6xl px-5 pb-16">{children}</main>
      </body>
    </html>
  );
}
