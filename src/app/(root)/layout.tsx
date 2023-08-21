import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "../globals.scss";
import { ReduxProvider } from "@/providers/ReduxProvider";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "@/components/layouts/MainLayout";
/* ====================================================== */

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X",
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
        <ReduxProvider>
          <MainLayout>{children}</MainLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
