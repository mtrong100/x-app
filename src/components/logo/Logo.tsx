import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div className="pb-3 px-5">
      <Link href="/">
        <Image
          className="rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-darkHover"
          src="/logo.png"
          alt="x-logo"
          width={40}
          height={40}
        />
      </Link>
    </div>
  );
};

export default Logo;
