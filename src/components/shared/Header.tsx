"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useAppSelector } from "@/redux/store";
import UserAvatar from "@/modules/user/UserAvatar";
/* ====================================================== */

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <section className="sticky z-[50] top-0 flex lg:hidden items-center justify-between w-full px-5 md:px-8 py-1 md:py-3 bg-darkGraphite">
      <Link href="/">
        <Image
          className="rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-darkHover"
          src="/logo.png"
          alt="x-logo"
          width={40}
          height={40}
        />
      </Link>
      <Link
        href={`/${user.slug}`}
        className="flex items-center justify-between rounded-full cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <UserAvatar avatar={user?.photoURL} />
        </div>
      </Link>
    </section>
  );
};

export default Header;
