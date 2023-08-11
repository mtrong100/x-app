import ToastProvider from "@/providers/ToastProvider";
import "../globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
/* ====================================================== */

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
      <body
        className={`${inter.className} flex items-center justify-center min-h-screen`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
