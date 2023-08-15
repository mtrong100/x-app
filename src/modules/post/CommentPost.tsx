import { CmtIcon } from "@/components/icons/Icon";
import { PostActionProps, TComment, TPostData } from "@/types/general.types";
import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import CreateComment from "../comment/CreateComment";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { storedPostData } from "@/redux/features/postSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";

interface CommentPostProps {
  data: TPostData;
}

const CommentPost = ({ data }: CommentPostProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const [commentList, setCommentList] = useState<TComment[]>([]);

  // Fetch comments in post
  useEffect(() => {
    if (!data.postId) return;
    const commentRef = collection(db, "posts", data?.postId, "comments");
    const unsubscribe = onSnapshot(commentRef, (snapshot) => {
      let results: TComment[] = [];
      snapshot.forEach((cmtDoc) => {
        const data = cmtDoc.data();
        if (data) {
          results.push({
            commentId: cmtDoc.id,
            comment: data.comment,
            commentImg: data.commentImg,
            userId: data.userId,
            postId: data.postId,
            createdAt: data.createdAt,
          });
        }
      });
      setCommentList(results);
    });

    return () => unsubscribe();
  }, [data.postId]);

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
        <span>{commentList && commentList.length}</span>
      </div>
      <CreateComment isOpen={isOpen} onClose={onClose}></CreateComment>
    </>
  );
};

export default CommentPost;
