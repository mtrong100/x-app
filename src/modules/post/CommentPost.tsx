import { CmtIcon } from "@/components/icons/Icon";
import { PostActionProps, TPostData } from "@/types/general.types";
import { useDisclosure } from "@nextui-org/react";
import React from "react";
import CreateComment from "../comment/CreateComment";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { storedPostData } from "@/redux/features/postSlice";

interface CommentPostProps {
  data: TPostData;
}

const CommentPost = ({ data }: CommentPostProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();

  // Handle toggle comment in post
  const toggleComment = (data: TPostData) => {
    if (!data) return;
    dispatch(storedPostData(data));
    onOpen();
  };

  return (
    <>
      <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
        <span
          onClick={() => toggleComment(data)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-500 hover:bg-opacity-20 hover:text-blue-500 "
        >
          <CmtIcon />
        </span>
        <span>19</span>
      </div>
      <CreateComment isOpen={isOpen} onClose={onClose}></CreateComment>
    </>
  );
};

export default CommentPost;
