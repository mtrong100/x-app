"use client";
import PostItem, { PostItemSkeleton } from "@/modules/post/PostItem";
import { v4 } from "uuid";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TPostData } from "@/types/general.types";
import { storedFollowing } from "@/redux/features/userSlice";
import { setPosts } from "@/redux/features/postSlice";
import { homeTab } from "@/constants/data";
import { db } from "@/utils/firebase";
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
import TabItem from "@/components/tab/TabItem";
/* ================================================================== */

export default function Home() {
  /* From redux */
  const dispatch = useDispatch<AppDispatch>();
  const { posts: postList } = useAppSelector((state) => state.post);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { following } = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("For you");
  const [followingPost, setFollowingPost] = useState<TPostData[]>([]);

  // Get "following" colRef from currentUser
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

  // Logic for the 'For you' tab
  const handleForYouTab = useCallback(async () => {
    setLoading(true);
    const postRef = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      const results: TPostData[] = [];
      snapshot.forEach((doc) => {
        const postData = doc.data() as TPostData;
        if (postData) {
          results.push({
            ...postData,
          });
        }
      });
      dispatch(setPosts(results));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Logic for the 'Following' tab
  const handleFollowingTab = useCallback(async () => {
    setLoading(true);
    const results: TPostData[] = [];

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
            ...postData,
          });
        }
      });
    }

    results.sort((a, b) => b.createdAt - a.createdAt);
    setFollowingPost(results);
    setLoading(false);
  }, [following]);

  // Main useEffect
  useEffect(() => {
    setLoading(true);
    async function fetchPosts() {
      if (active === "For you") {
        return handleForYouTab();
      } else if (active === "Following") {
        return handleFollowingTab();
      }
    }
    fetchPosts();
  }, [active, handleFollowingTab, handleForYouTab]);

  return (
    <>
      <header className="sticky top-0 z-20 bg-darkGraphite bg-opacity-70 backdrop-blur-md ">
        <h1 className="px-5 pt-5 pb-3 text-2xl font-semibold">Home</h1>
        <div className="flex items-center gap-1 border-b border-text_2">
          {homeTab.map((item) => (
            <TabItem
              key={v4()}
              value={item.name}
              activeTab={active}
              onTabClick={() => setActive(item.name)}
            />
          ))}
        </div>
      </header>

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
