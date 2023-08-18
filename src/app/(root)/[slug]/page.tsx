"use client";
import React, { useEffect, useState } from "react";
import PostItem, { PostItemSkeleton } from "@/modules/post/PostItem";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { TPostData } from "@/types/general.types";
import { setUser } from "@/redux/features/authSlice";
import { setPosts } from "@/redux/features/postSlice";
import { formatDateTime } from "@/utils/reuse-function";
import { db } from "@/utils/firebase";
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
import { v4 } from "uuid";
import Header from "@/components/header/Header";
/* ====================================================== */

const UserSlugPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const { posts: postList } = useAppSelector((state) => state.post);
  const date = formatDateTime(user?.createdAt);

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
    setLoading(true);
    if (!user.uid) return;
    const postRef = query(
      collection(db, "posts"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(postRef, (snapshot) => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, user.uid]);

  return (
    <>
      <Header username={user?.username} amount={postList.length} />
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

      <div className="w-full h-[1px] bg-text_2 mt-8"></div>

      {/* Skeleton loading */}
      {loading && (
        <section className="flex flex-col gap-10 p-5 mt-3">
          {Array(3)
            .fill(0)
            .map((index: number) => (
              <PostItemSkeleton key={v4()} />
            ))}
        </section>
      )}

      {/* Posts */}
      <section className="flex flex-col gap-10 p-5 mt-3">
        {postList &&
          postList.length > 0 &&
          postList.map((item: TPostData) => {
            return <PostItem key={item.postId} data={item} />;
          })}
      </section>
    </>
  );
};

export default UserSlugPage;
