import React from "react";
import { BsBookmark } from "react-icons/bs";

const SavePost = () => {
  return (
    <div className="flex items-center justify-center flex-1 ">
      <span className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-primaryColor hover:bg-opacity-30 hover:text-primaryColor">
        <BsBookmark />
      </span>
    </div>
  );
};

export default SavePost;
