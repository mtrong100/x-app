import { HeartIcon } from "@/components/icons/Icon";
import { AiFillHeart } from "react-icons/ai";
import { PostActionProps, TLikeData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import React, { useEffect, useState } from "react";
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
import { useAppSelector } from "@/redux/store";
/* ====================================================== */

const LikePost = ({ postId, userId }: PostActionProps) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
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
    const fetchUserLikePost = async () => {
      if (!postId || !currentUser.uid) return;
      const saveQuery = query(
        collection(db, "posts", postId, "like"),
        where("userId", "==", currentUser.uid)
      );
      try {
        const saveDocsSnapshot = await getDocs(saveQuery);
        saveDocsSnapshot.forEach((doc: any) => {
          const saveDocData = doc.data();
          if (saveDocData) {
            setUserLike(saveDocData as TLikeData);
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserLikePost();
  }, [postId, currentUser.uid]);

  // Handle toggle like post
  const toggleLike = async (postId: string) => {
    if (!postId || !userId) return;
    const likeDocRef = doc(db, "posts", postId, "likes", userId);
    const favoriteDocRef = doc(
      db,
      "users",
      currentUser?.uid,
      "favorite",
      postId
    );

    const batch = writeBatch(db);

    try {
      const likeDocSnap = await getDoc(likeDocRef);
      const favoriteDocSnap = await getDoc(favoriteDocRef);

      if (likeDocSnap.exists() || favoriteDocSnap.exists()) {
        batch.delete(likeDocRef);
        batch.delete(favoriteDocRef);
      } else {
        const likeData = {
          postId: postId,
          userId: currentUser?.uid,
          isLiked: true,
        };
        const favoriteData = {
          postId: postId,
          userId: userId,
          isFavorite: true,
        };

        batch.set(likeDocRef, likeData);
        batch.set(favoriteDocRef, favoriteData);
      }

      await batch.commit();

      // Update userLike state after toggling like (stale state at this point)
      setUserLike((prevUserLike) => ({
        ...prevUserLike,
        isLiked: !prevUserLike?.isLiked,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
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
