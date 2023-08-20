import React, { useEffect, useState } from "react";
import { TPostData, TSaveData, UserDataTypes } from "@/types/general.types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import LikePost from "./LikePost";
import RepostPost from "./RepostPost";
import SavePost from "./SavePost";
import CommentPost from "./CommentPost";
import UserAvatar from "../user/UserAvatar";
import UserMeta from "../user/UserMeta";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import ImageDisplay from "@/components/image/ImageDisplay";
import { formatDateTime } from "@/utils/reuse-function";
/* ====================================================== */

interface PostCardProps {
  data: TSaveData;
}

const PostCard = ({ data }: PostCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<UserDataTypes>({
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
  });
  const [post, setPost] = useState<TPostData>({
    postId: "",
    content: "",
    photos: [],
    userId: "",
    createdAt: null,
  });

  // Get user data
  useEffect(() => {
    async function fetchUser() {
      if (!data.userId) return;
      const postDocRef = doc(db, "users", data.userId);
      try {
        const userDocSnapshot = await getDoc(postDocRef);
        if (userDocSnapshot.exists()) {
          setUser(userDocSnapshot.data() as UserDataTypes);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [data.userId]);

  // Fetch post
  useEffect(() => {
    async function fetchPost() {
      if (!data.postId) return;
      const userDocRef = doc(db, "posts", data.postId);
      try {
        const postSnapshot = await getDoc(userDocRef);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data() as any;
          setPost({
            postId: data.postId,
            ...postData,
          });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [data.postId]);

  const date = formatDateTime(post?.createdAt);

  return (
    <>
      <div className="border-b border-text_2">
        <div className="flex items-center flex-1 gap-3">
          <UserAvatar className="w-[38px] h-[38px]" avatar={user?.photoURL} />
          <div className="flex items-start flex-1">
            <UserMeta username={user?.username} slug={user?.slug} date={date} />
          </div>
        </div>

        {/* Content and images */}
        <div className="mt-3">
          <p className="my-3">{post?.content}</p>
          <ImageDisplay hideIcon={false} images={post?.photos} />
        </div>

        {/* Post action */}
        <div className="flex items-center gap-10 px-3 py-2">
          <CommentPost data={post} />
          <LikePost postId={data?.postId} />
          <RepostPost postId={data?.postId} />
          <SavePost userId={data?.userId} postId={data?.postId} />
        </div>
      </div>
    </>
  );
};

export default PostCard;
