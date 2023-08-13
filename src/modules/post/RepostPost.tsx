import React from "react";
import { AiOutlineRetweet } from "react-icons/ai";

const RepostPost = () => {
  return (
    <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
      <span className="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-emerald-500 hover:bg-opacity-20 hover:text-emerald-500 ">
        <AiOutlineRetweet />
      </span>
      <span>19</span>
    </div>
  );
};

export default RepostPost;
