"use client";
import UserWallpaper from "@/modules/user/UserWallpaper";
import UserFollowing from "@/modules/user/UserFollowing";
import UserFollowers from "@/modules/user/UserFollowers";
import UserAvatar from "@/modules/user/UserAvatar";
import useFetchUserSlug from "@/hooks/useFetchUserSlug";
import useFetchTabData from "@/hooks/useFetchTabData";
import UpdateUser from "@/modules/user/UpdateUser";
import TabItem from "@/components/tab/TabItem";
import React, { useEffect, useState } from "react";
import PostItem, { PostItemSkeleton } from "@/modules/post/PostItem";
import Header from "@/components/header/Header";
import ButtonFollow from "@/components/button/ButtonFollow";
import { v4 } from "uuid";
import { useGetRepostPosts } from "@/hooks/useGetRepostPosts";
import { useGetPosts } from "@/hooks/useGetPosts";
import { useGetFavoritePosts } from "@/hooks/useGetFavoritePosts";
import { useDisclosure } from "@nextui-org/react";
import { useAppSelector } from "@/redux/store";
import { TPostData } from "@/types/general.types";
import { tabData } from "@/constants/data";
import { RiUserSettingsLine } from "react-icons/ri";
import { formatDateTime } from "@/utils/reuse-function";
import { BiCalendar } from "react-icons/bi";
/* ====================================================== */

const UserSlugPage = () => {
  /* Redux */
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { userData: user } = useAppSelector((state) => state.user);
  const { repostData, favoriteData } = useAppSelector((state) => state.post);

  /* Others */
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("posts");
  const date = formatDateTime(user?.createdAt);

  /* <======= Custom hooks ======> */
  useFetchUserSlug();
  useFetchTabData({ active, userUID: user?.uid, setLoading });
  const { postList, getPosts } = useGetPosts({
    userUID: user?.uid,
    setLoading,
  });
  const { favoriteList, getFavoriteList } = useGetFavoritePosts({
    data: favoriteData,
    setLoading,
  });
  const { repostList, getRepostList } = useGetRepostPosts({
    data: repostData,
    setLoading,
  });

  // Main useEffect
  useEffect(() => {
    setLoading(true);
    async function fetchPosts() {
      if (active === "reposts") {
        return getRepostList();
      } else if (active === "favorite") {
        return getFavoriteList();
      } else if (active === "posts") {
        return getPosts();
      }
    }
    fetchPosts();
  }, [active, getFavoriteList, getPosts, getRepostList]);

  // List to render type of posts
  const renderPosts = () => {
    let listToRender: TPostData[] = [];

    if (active === "reposts") {
      listToRender = repostList;
    } else if (active === "favorite") {
      listToRender = favoriteList;
    } else {
      listToRender = postList;
    }

    return listToRender.map((item: TPostData) => (
      <PostItem key={item.postId} data={item} />
    ));
  };

  // Toggle update user
  const toggleUpdateUser = () => {
    onOpen();
  };

  return (
    <>
      <Header username={user?.username} amount={postList.length} />
      <div className="relative">
        <UserWallpaper wallpaper={user?.wallpaper} />
        <UserAvatar
          className="w-[140px] h-[140px] absolute bottom-0 translate-x-2/4 translate-y-2/4 -left-5 border-[5px] border-darkGraphite "
          avatar={user?.photoURL}
        />
      </div>

      {/* User info */}
      <div className="px-10 mt-20">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">{user?.username}</h1>
              <p className="font-medium text-text_3">{`@${user?.slug}`}</p>
            </div>
            {currentUser.uid === user.uid && (
              <span
                onClick={toggleUpdateUser}
                className="flex items-center justify-center w-[35px] h-[35px] bg-darkHover border  rounded-full hover:bg-primaryColor text-white cursor-pointer"
              >
                <RiUserSettingsLine />
              </span>
            )}
          </div>
          <ButtonFollow uid={user.uid} />
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-text_3">
          <span className="text-xl">
            <BiCalendar />
          </span>
          <p>Joined {date}</p>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <UserFollowing />
          <UserFollowers />
        </div>
      </div>

      <section className="flex items-center my-5 capitalize border-b border-text_2">
        {tabData.map((item) => (
          <TabItem
            key={v4()}
            value={item.value}
            icon={item.icon}
            activeTab={active}
            onTabClick={() => setActive(item.value)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-10 p-5 mt-3">
        {loading &&
          Array(3)
            .fill(0)
            .map(() => <PostItemSkeleton key={v4()} />)}

        {!loading && renderPosts()}
      </section>

      <UpdateUser
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onClose={onClose}
      ></UpdateUser>
    </>
  );
};

export default UserSlugPage;
