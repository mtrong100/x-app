import type { Metadata } from "next";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Inter } from "next/font/google";
import "../globals.css";
/* ====================================================== */

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home /X",
  description: "Build X clone with Next JS 13 (App router)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-row w-full max-w-[1300px] mx-auto">
          <div className="flex flex-row w-full flex-1">
            <LeftSidebar />
            <section className="w-full max-w-5xl mx-auto flex-1 p-5">
              {children}
            </section>
          </div>
          <RightSidebar />
        </main>
      </body>
    </html>
  );
}
