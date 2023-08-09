"use client";
import { sidebarLinks } from "@/constants/data";
import { leftSidebarTypes } from "@/types/general.types";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "../logo/Logo";
/* ====================================================== */

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 w-[275px] h-screen z-20 overflow-auto border-r border-text_2 bg-primaryGradient p-5">
      <Logo />
      <ul className="flex flex-col gap-2 items-stretch">
        {sidebarLinks.map((link: leftSidebarTypes) => {
          const isActive = pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`${
                isActive
                  ? "bg-primaryColor text-white"
                  : "hover:bg-darkHover text-cloudGray hover:text-white"
              } flex items-center gap-3 py-3 text-lg font-semibold px-5 w-full rounded-full`}
            >
              <span>{link.icon}</span>
              <div>{link.name}</div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftSidebar;
