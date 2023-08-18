"use client";
import PostCard from "@/modules/post/PostCard";
import { PostItemSkeleton } from "@/modules/post/PostItem";
import { useAppSelector } from "@/redux/store";
import { TSaveData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
/* ====================================================== */

const BookmarkPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saveData, setSaveData] = useState<TSaveData[]>([]);

  // Get user post
  useEffect(() => {
    setLoading(true);
    if (!user.uid) return;
    const saveRef = collection(db, "users", user?.uid, "save");
    const unsubscribe = onSnapshot(saveRef, (snapshot) => {
      let results: TSaveData[] = [];
      snapshot.forEach((doc) => {
        const saveDoc = doc.data();
        if (saveDoc) {
          results.push({
            id: doc.id,
            userId: saveDoc.userId,
            postId: saveDoc.postId,
            isSaved: saveDoc.isSaved,
          });
        }
      });
      setSaveData(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <section>
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
        {saveData.length > 0 &&
          saveData.map((item: TSaveData) => {
            return <PostCard key={item.id} data={item} />;
          })}
      </section>
    </section>
  );
};

export default BookmarkPage;
