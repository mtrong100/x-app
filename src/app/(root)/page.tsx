"use client";
import Button from "@/components/button/Button";
import {
  CmtIcon,
  HeartIcon,
  RetweetIcon,
  ShareIcon,
} from "@/components/icons/Icon";
import Loading from "@/components/loading/Loading";
import PostItem from "@/modules/post/PostItem";
import { clearUser, setUser } from "@/redux/features/authSlice";
import { setPosts } from "@/redux/features/postSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { TPostData } from "@/types/general.types";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
/* ================================================================== */

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const { posts: postList } = useAppSelector((state) => state.post);
  const router = useRouter();

  // Watch user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
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
                uid,
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
    const postRef = query(
      collection(db, "posts"),
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
  }, [dispatch]);

  if (!user) return <Loading size="w-28 h-28" border="border-t-4 border-4" />;
  return (
    <>
      <div className="sticky top-0 bg-darkGraphite bg-opacity-70 backdrop-blur-md z-20 ">
        <h1 className="font-semibold text-2xl px-5 pt-5 pb-3">Home</h1>
        <div className=" flex items-center border-b border-text_2 ">
          <div className="flex-1 text-center relative p-3 text-white hover:bg-white hover:bg-opacity-5 cursor-pointer font-medium">
            For you
          </div>
          <div className="flex-1 text-center text-white p-3 hover:bg-white hover:bg-opacity-5 cursor-pointer font-medium">
            Following
          </div>
        </div>
      </div>

      <div className="border-b border-text_2 p-5">
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
            className="flex-1 p-2 bg-transparent outline-none  resize-none"
            placeholder="What is happening?!"
          />
        </div>
        <Button className="rounded-full py-2 ml-auto">Post</Button>
      </div>

      {/* Post item */}
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
    </>
  );
}
