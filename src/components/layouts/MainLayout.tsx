import NextuiProvider from "@/providers/NextuiProvider";
import ToastProvider from "@/providers/ToastProvider";
import React from "react";
import LeftSidebar from "../shared/LeftSidebar";
import RightSidebar from "../shared/RightSidebar";
import AuthProvider from "@/providers/AuthProvider";
/* ====================================================== */

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <NextuiProvider>
          <main className="flex flex-row w-full max-w-[1300px] mx-auto">
            <LeftSidebar />
            <section className="flex-1 w-full max-w-2xl border-r border-text_2">
              {children}
            </section>
            <RightSidebar />
          </main>
        </NextuiProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default MainLayout;
