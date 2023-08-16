"use client";
import Button from "@/components/button/Button";
import PostItem, { PostItemSkeleton } from "@/modules/post/PostItem";
import { clearUser, setUser } from "@/redux/features/authSlice";
import { setPosts } from "@/redux/features/postSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { TPostData } from "@/types/general.types";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import {
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
/* ================================================================== */

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts: postList } = useAppSelector((state) => state.post);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Watch user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        onSnapshot(docRef, (snapshot) => {
          snapshot.forEach((doc: any) => {
            const userData = doc.data();
            if (!userData) return;
            dispatch(
              setUser({
                uid: doc.id,
                ...userData,
              })
            );
          });
        });
      } else {
        dispatch(clearUser());
        router.push("/sign-in");
      }
    });
  }, [dispatch, router]);

  // Get all posts from firebase
  useEffect(() => {
    setLoading(true);
    const postRef = query(
      collection(db, "posts"),
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
  }, [dispatch]);

  return (
    <>
      <header className="sticky top-0 z-20 bg-darkGraphite bg-opacity-70 backdrop-blur-md ">
        <h1 className="px-5 pt-5 pb-3 text-2xl font-semibold">Home</h1>
        <div className="flex items-center border-b border-text_2">
          <div className="relative flex-1 p-3 font-medium text-center text-white cursor-pointer hover:bg-white hover:bg-opacity-5">
            For you
          </div>
          <div className="flex-1 p-3 font-medium text-center text-white cursor-pointer hover:bg-white hover:bg-opacity-5">
            Following
          </div>
        </div>
      </header>

      {/* User input */}
      <section className="p-5 border-b border-text_2">
        <div className="flex items-start gap-2">
          <div className="w-[45px] hover:opacity-70 h-[45px] rounded-full flex-shrink-0">
            <Image
              className="rounded-full img-cover"
              src="https://source.unsplash.com/random"
              width={100}
              height={100}
              alt="user-avatar"
            />
          </div>
          <textarea
            className="flex-1 p-2 bg-transparent outline-none resize-none"
            placeholder="What is happening?!"
          />
        </div>
        <Button className="py-2 ml-auto rounded-full">Post</Button>
      </section>

      {/* Skeleton loading */}
      {loading && (
        <section className="flex flex-col gap-10 p-5 ">
          {Array(3)
            .fill(0)
            .map((index: number) => (
              <PostItemSkeleton key={v4()} />
            ))}
        </section>
      )}

      {/* Rendering posts */}
      <section className="flex flex-col gap-10 p-5 ">
        {!loading &&
          postList &&
          postList.length > 0 &&
          postList.map((item: TPostData) => {
            return <PostItem key={item.postId} data={item} />;
          })}
      </section>
    </>
  );
}
