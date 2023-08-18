import { useAppSelector } from "@/redux/store";
import { PostActionProps, TRepost } from "@/types/general.types";
import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
/* ====================================================== */

const RepostPost = ({ postId, userId }: PostActionProps) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [repost, setRepost] = useState<TRepost[]>([]);
  const [userRepost, setUserRepost] = useState<TRepost>({
    id: "",
    postId: "",
    userId: "",
    isRepost: false,
  });

  // Get the amount of repost from post
  useEffect(() => {
    if (!postId) return;
    const repostRef = collection(db, "posts", postId, "repost");
    const unsubscribe = onSnapshot(repostRef, (snapshot) => {
      let results: TRepost[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data) {
          results.push({
            id: doc.id,
            ...data,
          });
        }
      });
      setRepost(results);
    });

    return () => {
      unsubscribe();
    };
  }, [postId]);

  // Get user's repost from post
  useEffect(() => {
    const fetchUserRepost = async () => {
      if (!postId || !currentUser.uid) return;
      const saveQuery = query(
        collection(db, "posts", postId, "repost"),
        where("userId", "==", currentUser.uid)
      );
      try {
        const saveDocsSnapshot = await getDocs(saveQuery);
        saveDocsSnapshot.forEach((doc: any) => {
          const saveDocData = doc.data();
          if (saveDocData) {
            setUserRepost(saveDocData as TRepost);
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserRepost();
  }, [currentUser.uid, postId]);

  // Handle toggle repost
  const toggleRepost = async (postId: string) => {
    if (!postId || !userId) return;
    const repostDoc = doc(db, "posts", postId, "repost", userId);
    const repostDocRef = doc(db, "users", currentUser?.uid, "repost", postId);
    const batch = writeBatch(db);

    try {
      const repostDocSnap = await getDoc(repostDoc);
      const repostDocRefSnap = await getDoc(repostDocRef);

      if (repostDocSnap.exists() && repostDocRefSnap.exists()) {
        batch.delete(repostDoc);
        batch.delete(repostDocRef);
      } else {
        batch.set(repostDoc, {
          postId: postId,
          userId: currentUser?.uid,
          isRepost: true,
        });
        batch.set(repostDocRef, {
          postId: postId,
          userId: userId,
          isRepost: true,
        });
      }
      await batch.commit();
      setUserRepost((prev) => ({
        ...prev,
        isRepost: !prev?.isRepost,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
      {userRepost?.isRepost ? (
        <span
          onClick={() => toggleRepost(postId)}
          className="flex items-center justify-center w-8 h-8 text-xl rounded-full text-emerald-500 hover:bg-emerald-500 hover:bg-opacity-20"
        >
          <AiOutlineRetweet />
        </span>
      ) : (
        <span
          onClick={() => toggleRepost(postId)}
          className="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-emerald-500 hover:bg-opacity-20 hover:text-emerald-500"
        >
          <AiOutlineRetweet />
        </span>
      )}

      <span>{repost.length}</span>
    </div>
  );
};

export default RepostPost;
