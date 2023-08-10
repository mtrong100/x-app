"use client";
import React, { useState } from "react";
import { SearchIcon } from "../icons/Icon";
import Image from "next/image";

const RightSidebar = () => {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  return (
    <div className="sticky right-0 top-0 z-20 flex h-screen flex-col overflow-auto p-5 w-[350px]">
      {/* Search bar */}
      <div
        className={`${
          isInputFocused ? "border-primaryColor" : "border-transparent"
        } flex items-center  w-full gap-3 py-2 px-3 rounded-full bg-primaryDark border`}
      >
        <SearchIcon />
        <input
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          className="w-full outline-none bg-transparent"
          type="text"
          placeholder="Search..."
        />
      </div>

      {/* Recommended user */}
      <div className="bg-primaryDark p-3 rounded-md mt-5">
        <h1 className="text-cloudGray font-bold text-lg">Recommended</h1>
        <ul className="flex flex-col gap-3 mt-3">
          {Array(5)
            .fill(0)
            .map((item, index) => (
              <li
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-slate-100 hover:bg-opacity-5"
              >
                <div className="flex items-center flex-1 gap-3">
                  <div className="w-[38px] hover:opacity-70 h-[38px] rounded-full flex-shrink-0">
                    <Image
                      className="rounded-full  img-cover"
                      src="https://source.unsplash.com/random"
                      width={100}
                      height={100}
                      alt="user-avatar"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="font-semibold text-white hover:underline">
                      mityoya
                    </h4>
                    <span className="text-text_4 text-sm">@mitoya</span>
                  </div>
                </div>
                <span className="px-5 hover:opacity-80 font-medium text-sm cursor-pointer rounded-full py-1 bg-white text-black">
                  Follow
                </span>
              </li>
            ))}
          <div className="flex  items-center justify-center cursor-pointer hover:bg-whiteSoft w-full p-2 rounded-full border border-text_1 hover:text-black font-semibold transition-all">
            See more
          </div>
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
