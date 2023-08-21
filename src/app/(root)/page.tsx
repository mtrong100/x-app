"use client";
import PostItem, { PostItemSkeleton } from "@/modules/post/PostItem";
import Image from "next/image";
import Button from "@/components/button/Button";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TPostData } from "@/types/general.types";
import { storedFollowing } from "@/redux/features/userSlice";
import { setPosts } from "@/redux/features/postSlice";
import { onAuthStateChanged } from "firebase/auth";
import { homeTab } from "@/constants/data";
import { clearUser, setUser } from "@/redux/features/authSlice";
import { auth, db } from "@/utils/firebase";
import { AppDispatch, useAppSelector } from "@/redux/store";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import UserAvatar from "@/modules/user/UserAvatar";
/* ================================================================== */

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { posts: postList } = useAppSelector((state) => state.post);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { following } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("For you");
  const [followingPost, setFollowingPost] = useState<TPostData[]>([]);

  // Check user !!
  useEffect(() => {
    if (!currentUser.email) {
      router.push("/sign-in");
    }
  }, [currentUser.email, router]);

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

  // Get data following
  useEffect(() => {
    if (!currentUser.uid || active === "For you") return;
    const followingRef = collection(db, "users", currentUser.uid, "following");
    const unsubscribe = onSnapshot(followingRef, (snapshot) => {
      let results: any = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      dispatch(storedFollowing(results));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [active, currentUser.uid, dispatch]);

  // Get all posts and post from following
  useEffect(() => {
    setLoading(true);
    if (active === "Following") {
      const getFollowingPosts = async () => {
        let results: TPostData[] = [];
        for (const followingUser of following) {
          const userPostsRef = query(
            collection(db, "posts"),
            where("userId", "==", followingUser.uid)
          );
          const userPostsSnapshot = await getDocs(userPostsRef);
          userPostsSnapshot.forEach((postDoc) => {
            const postData = postDoc.data() as TPostData;
            if (postData) {
              results.push({
                postId: postDoc.id,
                content: postData.content,
                photos: postData.photos,
                userId: postData.userId,
                createdAt: postData.createdAt,
              });
            }
          });
        }
        results.sort((a, b) => b.createdAt - a.createdAt);
        setFollowingPost(results);
        setLoading(false);
      };
      getFollowingPosts();
    } else if (active === "For you") {
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
    }
  }, [active, currentUser.uid, following, dispatch]);

  return (
    <>
      <header className="sticky top-0 z-20 bg-darkGraphite bg-opacity-70 backdrop-blur-md ">
        <h1 className="px-5 pt-5 pb-3 text-2xl font-semibold">Home</h1>
        <div className="flex items-center border-b border-text_2">
          {homeTab.map((item) => (
            <div
              onClick={() => setActive(item.name)}
              className={`${
                active === item.name
                  ? "border-primaryColor"
                  : "border-transparent"
              } relative flex-1 p-3 font-medium text-center text-white border-b-2 cursor-pointer hover:bg-white hover:bg-opacity-5`}
              key={v4()}
            >
              {item.name}
            </div>
          ))}
        </div>
      </header>

      {/* User input */}
      <section className="p-5 border-b border-text_2">
        <div className="flex items-start gap-2">
          <UserAvatar avatar={currentUser?.photoURL} />
          <textarea
            className="flex-1 p-2 bg-transparent outline-none resize-none"
            placeholder="What is happening?!"
          />
        </div>
        <Button className="py-2 ml-auto rounded-full">Post</Button>
      </section>

      {/* Rendering posts */}
      <section className="flex flex-col gap-10 p-5 ">
        {loading &&
          Array(3)
            .fill(0)
            .map(() => <PostItemSkeleton key={v4()} />)}

        {!loading &&
          active === "Following" &&
          followingPost.length > 0 &&
          followingPost.map((item: TPostData) => {
            return <PostItem key={item.postId} data={item} />;
          })}

        {!loading &&
          active === "For you" &&
          postList.length > 0 &&
          postList.map((item: TPostData) => {
            return <PostItem key={item.postId} data={item} />;
          })}
      </section>
    </>
  );
}
