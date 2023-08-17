"use client";
import React, { useEffect, useState } from "react";
import PostItem from "@/modules/post/PostItem";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { TPostData, TTabData } from "@/types/general.types";
import { setUser } from "@/redux/features/authSlice";
import { setPosts } from "@/redux/features/postSlice";
import { formatDateTime } from "@/utils/reuse-function";
import { db } from "@/utils/firebase";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiCalendar } from "react-icons/bi";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import UserAvatar from "@/modules/user/UserAvatar";
import UserWallpaper from "@/modules/user/UserWallpaper";
import Link from "next/link";
import { BsFilePost } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
/* ====================================================== */

const UserSlugPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const { slug } = useParams();
  const { posts: postList } = useAppSelector((state) => state.post);
  const [tabSelected, setTabSelected] = useState<string>("post");
  const date = formatDateTime(user?.createdAt);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      if (!slug) return;
      const userDocRef = query(
        collection(db, "users"),
        where("slug", "==", slug)
      );
      const querySnapshot = await getDocs(userDocRef);
      querySnapshot.forEach((doc: any) => {
        const userData = doc.data();
        if (userData) {
          dispatch(
            setUser({
              uid: doc.id,
              ...userData,
            })
          );
        }
      });
    }
    fetchUser();
  }, [dispatch, slug]);

  // Get user post
  useEffect(() => {
    if (!user.uid) return;
    const postRef = query(
      collection(db, "posts"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(postRef, (snapshot) => {
      let results: TPostData[] = [];
      snapshot.forEach((doc) => {
        const postData = doc.data();
        if (postData) {
          results.push({
            postId: doc.id,
            content: postData.content,
            photos: postData.photos,
            userId: postData.userId,
            createdAt: postData.createdAt,
          });
        }
      });
      dispatch(setPosts(results));
    });
  }, [dispatch, user.uid]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (tabSelected) {
      searchParams.set("tab", tabSelected);
    } else {
      searchParams.delete("tab");
    }

    const newPathname = `${
      window.location.pathname
    }?${searchParams.toString()}`;

    router.push(newPathname);
  }, [router, tabSelected]);

  const tabData = [
    {
      name: "Posts",
      value: "post",
      icon: <BsFilePost />,
    },
    {
      name: "Reposts",
      value: "repost",
      icon: <AiOutlineRetweet />,
    },
    {
      name: "Likes",
      value: "like",
      icon: <AiOutlineHeart />,
    },
  ];

  return (
    <section>
      <header className="p-3 bg-secondaryDark">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center justify-center w-[35px] h-[35px] rounded-full hover:bg-darkHover cursor-pointer"
          >
            <BsArrowLeftShort size={30} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{user?.username}</h1>
            <p className="text-sm font-medium text-text_3">2 posts</p>
          </div>
        </div>
      </header>

      <div className="relative">
        <UserWallpaper />
        <UserAvatar
          className="w-[140px] h-[140px] absolute bottom-0 translate-x-2/4 translate-y-2/4 -left-5 border-[5px] border-darkGraphite "
          avatar={user?.photoURL}
        />
      </div>

      {/* User info */}
      <div className="px-10 mt-20">
        <h1 className="text-xl font-bold text-white">{user?.username}</h1>
        <p className="font-medium text-text_3">{`@${user?.slug}`}</p>

        <div className="flex items-center gap-2 mt-2 text-sm text-text_3">
          <span className="text-xl">
            <BiCalendar />
          </span>
          <p>Joined {date}</p>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">2</span>
            <p className="text-text_3">Following</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">2</span>
            <p className="text-text_3">Followers</p>
          </div>
        </div>
      </div>

      {/* Tab indicator */}
      <div className="grid grid-cols-3 mt-5 border-b border-text_2">
        {tabData.map((item: TTabData) => (
          <li
            key={item.value}
            onClick={() => setTabSelected(item.value)}
            className={`${
              tabSelected === item.value
                ? "border-b-4 border-primaryColor  bg-primaryColor bg-opacity-10 text-primaryColor rounded-tl-md rounded-tr-md"
                : "bg-transparent hover:bg-darkHover border-transparent"
            } flex items-center space-x-2 w-full py-3 justify-center border-b-4  transition-all cursor-pointer relative`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </li>
        ))}
      </div>

      {/* Posts */}
      <section className="flex flex-col gap-10 p-5 mt-3">
        {postList &&
          postList.length > 0 &&
          postList.map((item: TPostData) => {
            return <PostItem key={item.postId} data={item} />;
          })}
      </section>
    </section>
  );
};

export default UserSlugPage;
