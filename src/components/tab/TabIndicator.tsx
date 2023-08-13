"use client";
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { BsFilePostFill, BsFiletypeGif } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

const TabIndicator = () => {
  return (
    <div className="flex w-full flex-col mt-5 px-5">
      <Tabs
        className="bg-secondaryDark rounded-lg"
        aria-label="Options"
        color="primary"
        variant="bordered"
      >
        <Tab
          style={{
            padding: "22px 0",
          }}
          key="post"
          title={
            <div className="flex items-center space-x-2 font-semibold">
              <BsFilePostFill />
              <span>Posts</span>
            </div>
          }
        />
        <Tab
          style={{
            padding: "22px 0",
          }}
          key="gif"
          title={
            <div className="flex items-center space-x-2 font-semibold">
              <BsFiletypeGif />
              <span>Gifs</span>
            </div>
          }
        />
        <Tab
          style={{
            padding: "22px 0",
          }}
          key="heart"
          title={
            <div className="flex items-center space-x-2 font-semibold">
              <AiOutlineHeart />
              <span>Videos</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
};

export default TabIndicator;
