import NextuiProvider from "@/providers/NextuiProvider";
import ToastProvider from "@/providers/ToastProvider";
import React from "react";
import LeftSidebar from "../shared/LeftSidebar";
import RightSidebar from "../shared/RightSidebar";
import AuthProvider from "@/providers/AuthProvider";
import LeftSidebarMobile from "../shared/LeftSidebarMobile";
import BottomBar from "../shared/Bottombar";
import Header from "../shared/Header";
/* ====================================================== */

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <NextuiProvider>
          <main className="lg:flex lg:max-w-[1300px] lg:mx-auto">
            <LeftSidebar />
            <LeftSidebarMobile />
            <Header />
            <section className="flex-1 pb-20 lg:pb-0 lg:border-r lg:max-w-2xl lg:border-text_2">
              {children}
            </section>
            <BottomBar />
            <RightSidebar />
          </main>
        </NextuiProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default MainLayout;
