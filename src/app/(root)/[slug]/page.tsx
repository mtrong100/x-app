"use client";
import React, { useEffect, useState } from "react";
import PostItem from "@/modules/post/PostItem";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { TPostData, TTabData } from "@/types/general.types";
import { tabData } from "@/constants/data";
import { setUser } from "@/redux/features/authSlice";
import { setPosts } from "@/redux/features/postSlice";
import { formatDate } from "@/utils/reuse-function";
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
/* ====================================================== */

const UserSlugPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const { slug } = useParams();
  const { posts: postList } = useAppSelector((state) => state.post);
  const date = formatDate(user?.createdAt);

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

  return (
    <section>
      <header className="bg-secondaryDark p-3">
        <div className="flex items-center gap-5">
          <span className="flex items-center justify-center w-[35px] h-[35px] rounded-full hover:bg-darkHover cursor-pointer">
            <BsArrowLeftShort size={30} />
          </span>
          <div>
            <h1 className="font-bold text-xl">{user?.username}</h1>
            <p className="text-sm font-medium text-text_3">2 posts</p>
          </div>
        </div>
      </header>
      <div className="relative">
        <div className="w-full h-[200px] bg-darkSaga">
          <Image
            className="img-cover"
            src="https://source.unsplash.com/random"
            alt="wallpaper"
            width={300}
            height={300}
          />
        </div>
        <div className="w-[140px] h-[140px] absolute bottom-0 translate-x-2/4 translate-y-2/4 -left-5 border-[5px] border-darkGraphite rounded-full">
          <Image
            className="rounded-full img-cover"
            src={user?.photoURL || "https://source.unsplash.com/random"}
            alt="user-avatar"
            width={300}
            height={300}
          />
        </div>
      </div>
      <div className="mt-20 px-10">
        <h1 className="font-bold text-xl text-white">{user?.username}</h1>
        <p className="text-text_3 font-medium">{`@${user?.slug}`}</p>

        <div className="flex mt-4 items-center gap-2 text-text_3 text-sm">
          <span className="text-xl">
            <BiCalendar />
          </span>
          <p>Joined {date}</p>
        </div>

        <div className="text-sm mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">2</span>
            <p className="text-text_3">Following</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">2</span>
            <p className="text-text_3">Followers</p>
          </div>
        </div>
      </div>

      {/* Tab Indicator */}
      <TabIndicator />

      {/* Render posts */}
      <div className="flex flex-col gap-10 mt-3 p-5">
        {postList &&
          postList.length > 0 &&
          postList.map((item: TPostData) => {
            return (
              <PostItem
                key={item.postId}
                postId={item.postId}
                content={item.content}
                photos={item.photos}
                userId={item.userId}
                createdAt={item.createdAt}
              />
            );
          })}
      </div>
    </section>
  );
};

const TabIndicator = () => {
  const [tabSelected, setTabSelected] = useState<string>("post");

  return (
    <div className="grid grid-cols-3 mt-5  border-b border-text_2">
      {tabData.map((item: TTabData) => (
        <div
          key={item.value}
          onClick={() => setTabSelected(item.value)}
          className={`${
            tabSelected === item.value
              ? "border-b-4 border-primaryColor  bg-primaryColor bg-opacity-10 text-primaryColor rounded-tl-md rounded-tr-md"
              : "bg-transparent hover:bg-darkHover border-transparent"
          } flex items-center space-x-2 w-full py-3 justify-center border-b-4  transition-all cursor-pointer relative`}
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default UserSlugPage;