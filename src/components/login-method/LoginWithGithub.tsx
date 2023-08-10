import React from "react";
import { FaGithub } from "react-icons/fa";
import { ArrowrightIcon } from "../icons/Icon";

const LoginWithGithub = () => {
  return (
    <div className="flex items-center group transition-all justify-between hover:bg-darkHover cursor-pointer  border border-text_2 p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          <FaGithub />
        </span>
        <p>Continue with Github</p>
      </div>
      <span className=" -translate-x-5 transition-all invisible duration-300 group-hover:visible  group-hover:translate-x-0 ">
        <ArrowrightIcon />
      </span>
    </div>
  );
};

export default LoginWithGithub;
