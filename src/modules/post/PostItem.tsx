import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TPostData, UserDataTypes } from "@/types/general.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { formatDateTime } from "@/utils/reuse-function";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import Link from "next/link";
import LikePost from "./LikePost";
import RepostPost from "./RepostPost";
import SavePost from "./SavePost";
import CommentPost from "./CommentPost";
import Skeleton from "@/components/loading/Skeleton";
/* ====================================================== */

interface PostItemProps {
  data: TPostData;
}

const PostItem = ({ data }: PostItemProps) => {
  const [user, setUser] = useState<UserDataTypes>({
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
  });
  const date = formatDateTime(data?.createdAt);

  // Get user data
  useEffect(() => {
    async function fetchUser() {
      if (!data.userId) return;
      const userDocRef = doc(db, "users", data.userId);
      try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUser(userDocSnapshot.data() as UserDataTypes);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [data.userId]);

  return (
    <div className="border-b border-text_2">
      <div className="flex items-center flex-1 gap-3">
        <div className="w-[38px] hover:opacity-70 h-[38px] rounded-full flex-shrink-0 select-none">
          <Image
            className="rounded-full select-none img-cover"
            src={user?.photoURL || "https://source.unsplash.com/random"}
            width={500}
            height={500}
            alt="user-avatar"
          />
        </div>
        <div className="flex items-center flex-1 gap-1">
          <Link
            href={`/${user.slug}`}
            className="font-semibold text-white hover:underline"
          >
            {user?.username}
          </Link>
          <span className="text-sm text-text_4">{`@${user.slug}`}</span>
          <span className="text-lg font-bold">.</span>
          <span className="text-sm text-text_4">{date}</span>
        </div>
      </div>

      {/* Content and images */}
      <div className="mt-3">
        <p className="text-sm">{data?.content}</p>
        {data?.photos && data?.photos.length > 0 && (
          <PostSlide data={data?.photos} />
        )}
      </div>

      {/* Post action */}
      <div className="flex items-center gap-10 px-3 py-2">
        <CommentPost data={data} />
        <LikePost userId={data?.userId} postId={data?.postId} />
        <RepostPost />
        <SavePost />
      </div>
    </div>
  );
};

export default PostItem;

function PostSlide({ data }: { data: string[] }) {
  return (
    <Swiper
      slidesPerView={1}
      loop={true}
      grabCursor={true}
      centeredSlides={true}
      navigation={true}
      modules={[Navigation]}
      className=" mySwiper"
    >
      {data?.map((image, index) => (
        <SwiperSlide className="mt-4 select-none rounded-xl" key={index}>
          <Image
            className="object-contain w-full h-full rounded-xl"
            priority
            src={image}
            width={500}
            height={500}
            alt="user-avatar"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export const PostItemSkeleton = () => {
  return (
    <div className="pb-4 border-b-2 border-darkSaga">
      <div className="flex items-center flex-1 gap-3">
        <Skeleton className="w-[42px] h-[42px] rounded-full flex-shrink-0 select-none" />
        <div className="flex items-center flex-1 gap-1">
          <Skeleton className="w-32 h-6 rounded-md" />
        </div>
      </div>
      <div className="mt-3">
        <Skeleton className="w-full h-5 rounded-md" />
        <Skeleton className="w-[350px] h-5 mt-2 rounded-md" />
        <Skeleton className="mt-4  rounded-lg w-full h-[300px]" />
      </div>
    </div>
  );
};
