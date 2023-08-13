import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TPostData, UserDataTypes } from "@/types/general.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { formatDate } from "@/utils/reuse-function";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import {
  CmtIcon,
  HeartIcon,
  RetweetIcon,
  ShareIcon,
} from "@/components/icons/Icon";
import Link from "next/link";
/* ====================================================== */

interface PostItemProps extends TPostData {}

const PostItem = ({
  content,
  photos,
  userId,
  postId,
  createdAt,
}: PostItemProps) => {
  const [user, setUser] = useState<UserDataTypes>({
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
  });
  const date = formatDate(createdAt);

  // Get user data
  useEffect(() => {
    async function fetchUser() {
      const userDocRef = doc(db, "users", userId);
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
  }, [userId]);

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
        <div className="flex gap-1 items-center flex-1">
          <Link
            href={`/${user.slug}`}
            className="font-semibold text-white hover:underline"
          >
            {user?.username}
          </Link>
          <span className="text-text_4 text-sm">{`@${user.slug}`}</span>
          <span className="font-bold text-lg">.</span>
          <span className="text-text_4 text-sm">{date}</span>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm">{content}</p>
        {photos && photos.length > 0 && <PostSlide photos={photos} />}
      </div>
      <div className="flex items-center gap-5 justify-between py-3 px-5">
        <div className="flex items-center gap-3 ">
          <span>
            <CmtIcon />
          </span>
          <span>19</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <HeartIcon />
          </span>
          <span>19</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <RetweetIcon />
          </span>
          <span>19</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <ShareIcon />
          </span>
          <span>19</span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;

function PostSlide({ photos }: { photos: string[] }) {
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
      {photos?.map((image, index) => (
        <SwiperSlide className="mt-4 select-none" key={index}>
          <Image
            className="rounded-md w-full h-full object-contain"
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
