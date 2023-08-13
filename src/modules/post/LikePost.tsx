import { HeartIcon } from "@/components/icons/Icon";
import { AiFillHeart } from "react-icons/ai";
import { PostActionProps, TLikeData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
/* ====================================================== */

const LikePost = ({ postId, userId }: PostActionProps) => {
  const [likes, setLikes] = useState<TLikeData[]>([]);
  const [userLike, setUserLike] = useState<TLikeData>({
    id: "",
    postId: "",
    userId: "",
    isLiked: false,
  });

  // Get the amount of likes from post
  useEffect(() => {
    if (!postId) return;
    const likeRef = collection(db, "posts", postId, "likes");
    const unsubscribe = onSnapshot(likeRef, (snapshot) => {
      let results: TLikeData[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data) {
          results.push({
            id: doc.id,
            ...data,
          });
        }
      });
      setLikes(results);
    });

    return () => {
      unsubscribe();
    };
  }, [postId]);

  // Get user's like from post
  useEffect(() => {
    if (!postId || !userId) return;
    const likeDocRef = doc(db, "posts", postId, "likes", userId);
    const fetchUserLikePost = async () => {
      const likeDocSnap = await getDoc(likeDocRef);
      const likeDocData = likeDocSnap.data();
      if (likeDocData) {
        setUserLike(likeDocData as TLikeData);
      }
    };

    fetchUserLikePost();
  }, [postId, userId]);

  // Handle toggle like post
  const toggleLike = async (postId: string) => {
    if (!postId || !userId) return;
    const likeDocRef = doc(db, "posts", postId, "likes", userId);
    const likeDocSnap = await getDoc(likeDocRef);

    if (likeDocSnap.exists()) {
      await deleteDoc(likeDocRef);
    } else {
      await setDoc(likeDocRef, {
        postId: postId,
        userId: userId,
        isLiked: true,
      });
    }

    // Update userLike state after toggling like (stale state at this point)
    setUserLike((prevUserLike) => ({
      ...prevUserLike,
      isLiked: !prevUserLike?.isLiked,
    }));
  };

  return (
    <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
      {userLike?.isLiked ? (
        <span
          onClick={() => toggleLike(postId)}
          className="flex items-center justify-center w-8 h-8 text-xl rounded-full text-rose-500 hover:bg-rose-500 hover:bg-opacity-20 hover:text-rose-500 "
        >
          <AiFillHeart />
        </span>
      ) : (
        <span
          onClick={() => toggleLike(postId)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-rose-500 hover:bg-opacity-20 hover:text-rose-500 "
        >
          <HeartIcon />
        </span>
      )}

      <span>{likes.length}</span>
    </div>
  );
};

export default LikePost;
