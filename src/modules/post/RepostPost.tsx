import { useAppSelector } from "@/redux/store";
import { TRepost } from "@/types/general.types";
import { db } from "@/utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
/* ====================================================== */

const RepostPost = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [repost, setRepost] = useState<TRepost[]>([]);
  const [userRepost, setUserRepost] = useState<TRepost[]>([]);

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

  // Get user repost from post
  useEffect(() => {
    if (!currentUser.uid) return;
    const colRef = collection(db, "users", currentUser?.uid, "repost");
    onSnapshot(colRef, (snapshot) => {
      let results: TRepost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TRepost;
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      setUserRepost(results);
    });
  }, [currentUser.uid]);

  // Handle toggle repost
  const toggleRepost = async (postId: string) => {
    if (!currentUser || !currentUser.email) {
      router.push("/sign-in");
    }
    if (!currentUser.uid) return;
    const repostDoc = doc(db, "posts", postId, "repost", currentUser.uid);
    const repostDocRef = doc(db, "users", currentUser?.uid, "repost", postId);

    const repostSnap = await getDoc(repostDoc);
    const repostDocSnap = await getDoc(repostDocRef);

    if (repostSnap.exists() && repostDocSnap.exists()) {
      await Promise.all([deleteDoc(repostDoc), deleteDoc(repostDocRef)]);
    } else {
      await Promise.all([
        setDoc(repostDoc, {
          uid: currentUser.uid,
          isRepost: true,
        }),
        setDoc(repostDocRef, {
          postId: postId,
          isRepost: true,
        }),
      ]);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
      {userRepost.some((item) => item.postId === postId) ? (
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
