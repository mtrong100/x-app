import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ArrowrightIcon } from "@/components/icons/Icon";
/* ====================================================== */

const SigupPage = () => {
  return (
    <div className="h-screen flex items-center justify-center w-full ">
      <div className="w-full gap-10 md:max-w-lg bg-secondaryDark p-5 rounded-lg">
        <Link href="/">
          <Image
            className="rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-darkHover"
            src="/logo.png"
            alt="x-logo"
            width={40}
            height={40}
          />
        </Link>
        <h1 className="mt-5 mb-2 font-bold text-2xl">Sign up</h1>
        <p>Or continue with</p>
        <div className="w-full mt-5 flex flex-col gap-3">
          {/* Login with google */}
          <div className="flex items-center group transition-all justify-between hover:bg-darkHover cursor-pointer  border border-text_2 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                <FcGoogle />
              </span>
              <p>Continue with Google</p>
            </div>
            <span className=" -translate-x-5 transition-all invisible duration-300 group-hover:visible  group-hover:translate-x-0 ">
              <ArrowrightIcon />
            </span>
          </div>
          {/* Login with github */}
          <div className="flex items-center group transition-all justify-between hover:bg-darkHover cursor-pointer  border border-text_2 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                <FaGithub />
              </span>
              <p>Continue with Google</p>
            </div>
            <span className=" -translate-x-5 transition-all invisible duration-300 group-hover:visible  group-hover:translate-x-0 ">
              <ArrowrightIcon />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigupPage;
