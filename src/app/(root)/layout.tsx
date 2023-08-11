import type { Metadata } from "next";
import ToastProvider from "@/providers/ToastProvider";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "../globals.scss";
import { ReduxProvider } from "@/providers/ReduxProvider";

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
        <ToastProvider>
          <ReduxProvider>
            <main className="flex flex-row w-full max-w-[1300px] mx-auto">
              <div className="flex flex-row w-full flex-1">
                <LeftSidebar />
                <section className="w-full max-w-4xl mx-auto flex-1 ">
                  {children}
                </section>
              </div>
              <RightSidebar />
            </main>
          </ReduxProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
