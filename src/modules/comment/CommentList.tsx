import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/reuse-function";
/* ====================================================== */

type TComment = {
  commentId: string;
  comment: string;
  commentImg: string;
  userId: string;
  postId: string;
  createdAt: any;
};

const CommentList = ({ postId }: { postId: string }) => {
  const [commentList, setCommentList] = useState<TComment[]>([]);

  // Fetch comments in post
  useEffect(() => {
    const commentRef = collection(db, "posts", postId, "comments");
    onSnapshot(commentRef, (snapshot) => {
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
  }, [postId]);

  return (
    <section className="flex flex-col gap-3 pt-3 mt-5">
      {commentList &&
        commentList.length > 0 &&
        commentList.map((item: TComment) => (
          <CommentItem key={item.commentId} data={item} />
        ))}
    </section>
  );
};

interface CommentItemProps {
  data: TComment;
}

function CommentItem({ data }: CommentItemProps) {
  const date = formatDate(data?.createdAt);

  return (
    <div className="relative flex items-start gap-3 pb-3">
      <div className="w-[45px] border-2 border-primaryColor h-[45px] rounded-full flex-shrink-0 select-none">
        <Image
          className="rounded-full select-none img-cover"
          src={"https://source.unsplash.com/random"}
          width={500}
          height={500}
          alt="user-avatar"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <Link href="/" className="font-semibold text-white hover:underline">
            {`chjgasdf`}
          </Link>
          <span className="text-sm text-text_4">{`@joan`}</span>
          <span className="text-lg font-bold">.</span>
          <span className="text-sm text-text_4">{date}</span>
        </div>
        <p className="mt-1 text-base">{data?.comment}</p>
      </div>
      {/* Line */}
      <div className="absolute top-0 translate-x-5 -z-10 w-[2px] rounded-full h-full bg-text_3"></div>
    </div>
  );
}

export default CommentList;
