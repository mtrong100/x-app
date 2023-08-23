import { HeartIcon } from "@/components/icons/Icon";
import { AiFillHeart } from "react-icons/ai";
import { TFavorite, TLikeData } from "@/types/general.types";
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
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
/* ====================================================== */

const LikePost = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [likes, setLikes] = useState<TLikeData[]>([]);
  const [userFavorite, setUserFavorite] = useState<TFavorite[]>([]);

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

  // Get user favorite post
  useEffect(() => {
    if (!currentUser.uid) return;
    const colRef = collection(db, "users", currentUser?.uid, "favorite");
    onSnapshot(colRef, (snapshot) => {
      let results: TFavorite[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TFavorite;
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      setUserFavorite(results);
    });
  }, [currentUser.uid]);

  // Handle toggle like post
  const toggleLike = async (postId: string) => {
    if (!currentUser || !currentUser.email) {
      router.push("/sign-in");
    }
    if (!currentUser.uid) return;
    const likeDocRef = doc(db, "posts", postId, "likes", currentUser.uid);
    const favoriteDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "favorite",
      postId
    );

    const likeDocSnap = await getDoc(likeDocRef);
    const favoriteDocSnap = await getDoc(favoriteDocRef);

    if (likeDocSnap.exists() && favoriteDocSnap.exists()) {
      await Promise.all([deleteDoc(likeDocRef), deleteDoc(favoriteDocRef)]);
    } else {
      await Promise.all([
        setDoc(likeDocRef, {
          uid: currentUser.uid,
          isLiked: true,
        }),
        setDoc(favoriteDocRef, {
          postId: postId,
          isLiked: true,
        }),
      ]);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 gap-1 cursor-pointer">
      {userFavorite.some((item) => item.postId === postId) ? (
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
