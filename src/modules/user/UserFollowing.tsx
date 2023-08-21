import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TFollow } from "@/types/general.types";
import { storedFollowing } from "@/redux/features/userSlice";
import { db } from "@/utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
/* ====================================================== */

const UserFollowing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData: user, following } = useAppSelector((state) => state.user);

  // Get user following length
  useEffect(() => {
    if (!user.uid) return;
    const colRef = collection(db, "users", user?.uid, "following");
    onSnapshot(colRef, (snapshot) => {
      let results: TFollow[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TFollow;
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      dispatch(storedFollowing(results));
    });
  }, [dispatch, user.uid]);

  return (
    <Link
      href={`/${user?.slug}/following`}
      className="flex items-center gap-1 cursor-pointer"
    >
      <span className="font-semibold text-white">{following.length}</span>
      <p className="text-text_3 hover:underline hover:text-white">Following</p>
    </Link>
  );
};

export default UserFollowing;
