import Link from "next/link";
import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";

interface HeaderProps {
  username: string;
  amount: number;
  className?: string;
}

const Header = ({ username = "", amount = 0, className = "" }: HeaderProps) => {
  return (
    <header className={`${className} p-3 bg-secondaryDark`}>
      <div className="flex items-center gap-5">
        <Link
          href="/"
          className="flex items-center justify-center w-[35px] h-[35px] rounded-full hover:bg-darkHover cursor-pointer"
        >
          <BsArrowLeftShort size={30} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{username}</h1>
          <p className="text-sm font-medium text-text_3">{amount} posts</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
