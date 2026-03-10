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
        <div className="app-shell">
          <Nav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
