import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { v4 } from "uuid";
import { TComment } from "@/types/general.types";
import CommentItem, { CommentItemSkeleton } from "./CommentItem";
/* ====================================================== */

const CommentList = ({ postId }: { postId: string }) => {
  const [commentList, setCommentList] = useState<TComment[]>([]);
  const [loading, setLoading] = useState(true);
  const totalComment = commentList && commentList.length;

  // Fetch comments in post
  useEffect(() => {
    setLoading(true);
    const commentRef = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "desc")
    );
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <section className="flex flex-col ">
      {/* Skeleton loading */}
      {loading &&
        Array(5)
          .fill(0)
          .map(() => <CommentItemSkeleton key={v4()} />)}

      {!loading &&
        commentList &&
        commentList.length > 0 &&
        commentList.map((item: TComment, index: number) => (
          <CommentItem
            key={item.commentId}
            data={item}
            index={index}
            totalComment={totalComment}
          />
        ))}
    </section>
  );
};

export default CommentList;
