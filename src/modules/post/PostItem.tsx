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
import LikePost from "./LikePost";
import RepostPost from "./RepostPost";
import SavePost from "./SavePost";
import CommentPost from "./CommentPost";
import Skeleton from "@/components/loading/Skeleton";
import { Autoplay } from "swiper/modules";
import UserAvatar from "../user/UserAvatar";
import UserMeta from "../user/UserMeta";
import IconDropdown from "@/components/dropdown/IconDropdown";
import { useDisclosure } from "@nextui-org/react";
import UpdatePost from "./UpdatePost";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { storedPostData } from "@/redux/features/postSlice";
import ImageDisplay from "@/components/image/ImageDisplay";
/* ====================================================== */

interface PostItemProps {
  data: TPostData;
}

const PostItem = ({ data }: PostItemProps) => {
  const date = formatDateTime(data?.createdAt);
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [user, setUser] = useState<UserDataTypes>({
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
  });

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

  // Handle update post
  const togglePost = () => {
    onOpen();
    dispatch(storedPostData(data));
  };

  // Handle delete post
  const deletePost = () => {};

  return (
    <>
      <div className="border-b border-text_2">
        <div className="flex items-center flex-1 gap-3">
          <UserAvatar className="w-[38px] h-[38px]" avatar={user?.photoURL} />
          <div className="flex items-start flex-1">
            <UserMeta username={user?.username} slug={user?.slug} date={date} />

            {currentUser?.uid === data?.userId && (
              <IconDropdown
                editText="Update post"
                deleteText="Delete post"
                editItem={togglePost}
                data={data}
                deleteItem={deletePost}
              />
            )}
          </div>
        </div>

        {/* Content and images */}
        <div className="mt-3">
          <p className="my-3">{data?.content}</p>
          <ImageDisplay hideIcon={false} images={data?.photos} />
        </div>

        {/* Post action */}
        <div className="flex items-center gap-10 px-3 py-2">
          <CommentPost data={data} />
          <LikePost userId={data?.userId} postId={data?.postId} />
          <RepostPost />
          <SavePost />
        </div>
      </div>
      <UpdatePost isOpen={isOpen} onClose={onClose}></UpdatePost>
    </>
  );
};

export default PostItem;

function PostSlide({ data }: { data: string[] }) {
  return (
    <Swiper
      slidesPerView={2}
      loop={true}
      spaceBetween={6}
      grabCursor={true}
      navigation={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        // 640: {
        //   slidesPerView: 1,
        // },
        768: {
          slidesPerView: 2,
        },
      }}
      modules={[Navigation, Autoplay]}
      className=" mySwiper"
    >
      {data?.map((image, index) => (
        <SwiperSlide className="mt-4 select-none" key={index}>
          <div className="w-full h-full">
            <Image
              className="rounded img-cover"
              src={image}
              width={500}
              height={500}
              alt="user-avatar"
            />
          </div>
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
