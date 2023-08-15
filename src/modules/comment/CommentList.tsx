import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "@/utils/reuse-function";
import Skeleton from "@/components/loading/Skeleton";
import { v4 } from "uuid";
import { TComment, UserDataTypes } from "@/types/general.types";
import { BsThreeDots } from "react-icons/bs";
import { useDisclosure } from "@nextui-org/react";
import ToggleComment from "./ToggleComment";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { storedCommentData } from "@/redux/features/postSlice";
/* ====================================================== */

const CommentList = ({ postId }: { postId: string }) => {
  const [commentList, setCommentList] = useState<TComment[]>([]);
  const [loading, setLoading] = useState(true);
  const totalComment = commentList && commentList.length;

  // Fetch comments in post
  useEffect(() => {
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

interface CommentItemProps {
  data: TComment;
  totalComment: any;
  index: number;
}

function CommentItem({ data, totalComment, index }: CommentItemProps) {
  const [userData, setUserData] = useState<UserDataTypes>({
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: null,
  });
  const date = formatDateTime(data?.createdAt);
  const dispatch = useDispatch<AppDispatch>();
  const showLine = index !== totalComment - 1;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch user data in comments
  useEffect(() => {
    async function fetchUserData() {
      if (!data.userId) return;
      const userDocRef = doc(db, "users", data?.userId);
      const userDocSnap = await getDoc(userDocRef);
      const userDocData = userDocSnap.data() as UserDataTypes;
      if (userDocData) {
        setUserData(userDocData);
      }
    }
    fetchUserData();
  }, [data]);

  // Handle toggle comment
  const toggleComment = (commentData: TComment) => {
    console.log(commentData);
    dispatch(storedCommentData(commentData));
    onOpen();
  };

  return (
    <>
      <div className="relative flex items-center justify-between gap-3 pb-6 ">
        <div className="flex items-start gap-3">
          <div className="w-[45px] border-2 border-primaryColor h-[45px] rounded-full flex-shrink-0 select-none">
            <Image
              className="rounded-full select-none img-cover"
              src={userData?.photoURL || "https://source.unsplash.com/random"}
              width={300}
              height={300}
              alt="user-avatar"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="font-semibold text-white hover:underline"
              >
                {userData?.username}
              </Link>
              <span className="text-sm text-text_4">{`@${userData?.slug}`}</span>
              <span className="text-lg font-bold">.</span>
              <span className="text-sm text-text_4">{date}</span>
            </div>
            <p className="mb-2 text-base">{data?.comment}</p>
            {data?.commentImg && (
              <div className="relative w-fit">
                <Image
                  priority
                  src={data?.commentImg || "https://source.unsplash.com/random"}
                  width={250}
                  height={250}
                  alt="image-from-user"
                  className="object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Toggle edit and delete comment */}
        <div className="flex items-center justify-end flex-1 flex-shrink-0">
          <span
            onClick={() => toggleComment(data)}
            className="flex items-center justify-center w-[35px] h-[35px] text-xl bg-text_2 rounded-full hover:bg-darkGraphite cursor-pointer"
          >
            <BsThreeDots />
          </span>
        </div>

        {/* Line */}
        {showLine && (
          <div className="absolute top-0 translate-x-5 -z-10 w-[2px] rounded-full h-full bg-text_3"></div>
        )}
      </div>
      <ToggleComment isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export const CommentItemSkeleton = () => {
  return (
    <div className="relative flex items-start gap-3 pb-6">
      <Skeleton
        bgColor="secondary"
        className="rounded-full h-[45px] w-[45px] flex-shrink-0 select-none"
      />
      <div className="flex-1 h-full ">
        <Skeleton bgColor="secondary" className="h-3 rounded-sm w-28" />
        <Skeleton
          bgColor="secondary"
          className="flex-1 w-full h-[100px] mt-2 rounded-md "
        />
      </div>
      <div className="absolute top-0 translate-x-5 -z-10 w-[2px] rounded-full h-full bg-text_3"></div>
    </div>
  );
};
