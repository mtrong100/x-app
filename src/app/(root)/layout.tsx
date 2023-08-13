import type { Metadata } from "next";
import ToastProvider from "@/providers/ToastProvider";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "../globals.scss";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NextuiProvider from "@/providers/NextuiProvider";
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
            <NextuiProvider>
              <main className="flex flex-row w-full max-w-[1300px] mx-auto">
                <LeftSidebar />
                <section className="w-full max-w-2xl flex-1 border-r border-text_2">
                  {children}
                </section>
                <RightSidebar />
              </main>
            </NextuiProvider>
          </ReduxProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
