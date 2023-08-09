import "../globals.css";
import { Inter } from "next/font/google";
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
      </body>
    </html>
  );
}
