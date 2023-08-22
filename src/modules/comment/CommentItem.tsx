import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CommentItemProps,
  TComment,
  UserDataTypes,
} from "@/types/general.types";
import { setIsUpdateCmt, storedCommentData } from "@/redux/features/postSlice";
import { formatDateTime } from "@/utils/reuse-function";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { db } from "@/utils/firebase";
import Skeleton from "@/components/loading/Skeleton";
import UserMeta from "../user/UserMeta";
import UserAvatar from "../user/UserAvatar";
import ImageCmt from "@/components/image/ImageCmt";
import IconDropdown from "@/components/dropdown/IconDropdown";
/* ====================================================== */

const CommentItem = ({ data, totalComment, index }: CommentItemProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const date = formatDateTime(data?.createdAt);
  const dispatch = useDispatch<AppDispatch>();
  const showLine = index !== totalComment - 1;
  const [userData, setUserData] = useState<UserDataTypes>({
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: null,
    wallpaper: "",
  });

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
    dispatch(storedCommentData(commentData));
    dispatch(setIsUpdateCmt(true));
  };

  // Delete comment
  const deleteComment = async (data: TComment) => {
    if (!data?.postId && !data?.commentId) return;
    const commentDocRef = doc(
      db,
      "posts",
      data?.postId,
      "comments",
      data?.commentId
    );
    await deleteDoc(commentDocRef);
  };

  return (
    <>
      <div className="relative flex items-start justify-between gap-3 pb-6 ">
        <div className="flex items-start gap-3">
          <UserAvatar avatar={userData?.photoURL} />
          <div className="flex-1">
            <UserMeta
              username={userData?.username}
              slug={userData?.slug}
              date={date}
            />
            <p className="mb-2 text-base">{data?.comment}</p>
            {data?.commentImg && <ImageCmt image={data?.commentImg} />}
          </div>
        </div>
        {userData?.email === user?.email && (
          <IconDropdown
            editItem={toggleComment}
            data={data}
            deleteItem={deleteComment}
          />
        )}
        {showLine && <div className="verical-line"></div>}
      </div>
    </>
  );
};

export default CommentItem;

export const CommentItemSkeleton = () => {
  return (
    <div className="relative flex items-start gap-3 pb-6">
      <Skeleton
        bgcolor="secondary"
        className="rounded-full h-[45px] w-[45px] flex-shrink-0 select-none"
      />
      <div className="flex-1 h-full ">
        <Skeleton bgcolor="secondary" className="h-3 rounded-sm w-28" />
        <Skeleton
          bgcolor="secondary"
          className="flex-1 w-full h-[100px] mt-2 rounded-md "
        />
      </div>
      <div className="absolute top-0 translate-x-5 -z-10 w-[2px] rounded-full h-full bg-text_3"></div>
    </div>
  );
};
