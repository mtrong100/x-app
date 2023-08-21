"use client";
import PostItem, { PostItemSkeleton } from "@/modules/post/PostItem";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { TPostData, TSaveData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
/* ====================================================== */

const BookmarkPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saveData, setSaveData] = useState<TSaveData[]>([]);
  const [savePosts, setSavePosts] = useState<TPostData[]>([]);

  // Get user post
  useEffect(() => {
    if (!user.uid) return;
    const saveRef = collection(db, "users", user?.uid, "save");
    const unsubscribe = onSnapshot(saveRef, (snapshot) => {
      let results: TSaveData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          results.push({
            id: doc.id,
            userId: data.userId,
            postId: data.postId,
            isSaved: data.isSaved,
          });
        }
      });
      setSaveData(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  // Get save post data
  useEffect(() => {
    const getSavePosts = async () => {
      if (!saveData) return;
      setLoading(true);

      const postsRef = collection(db, "posts");
      const postsSnapshot = await getDocs(postsRef);
      const allPosts: TPostData[] = [];
      postsSnapshot.forEach((postDoc) => {
        const postData = postDoc.data() as TPostData;
        if (postData) {
          allPosts.push({
            ...postData,
          });
        }
      });

      allPosts.sort((a, b) => b.createdAt - a.createdAt);

      // Get the correct save post
      const filteredPosts = allPosts.filter((post) =>
        saveData.some((savedItem) => savedItem.postId === post.postId)
      );

      setSavePosts(filteredPosts);
      setLoading(false);
    };
    getSavePosts();
  }, [saveData]);

  return (
    <section className="flex flex-col gap-10 p-5 mt-3">
      {loading &&
        Array(3)
          .fill(0)
          .map(() => <PostItemSkeleton key={v4()} />)}

      {!loading &&
        savePosts.length > 0 &&
        savePosts.map((item: any) => {
          return <PostItem key={v4()} data={item} />;
        })}
    </section>
  );
};

export default BookmarkPage;
