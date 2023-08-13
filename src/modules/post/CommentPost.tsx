import { CmtIcon } from "@/components/icons/Icon";
import React from "react";

const CommentPost = () => {
  return (
    <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
      <span className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-500 hover:bg-opacity-20 hover:text-blue-500 ">
        <CmtIcon />
      </span>
      <span>19</span>
    </div>
  );
};

export default CommentPost;
