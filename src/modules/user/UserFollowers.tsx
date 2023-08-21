import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TFollow } from "@/types/general.types";
import { storedFollowers } from "@/redux/features/userSlice";
import { db } from "@/utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
/* ====================================================== */

const UserFollowers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData: user, followers } = useAppSelector((state) => state.user);

  // Get user followers length
  useEffect(() => {
    if (!user.uid) return;
    const colRef = collection(db, "users", user?.uid, "followers");
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
      dispatch(storedFollowers(results));
    });
  }, [dispatch, user.uid]);

  return (
    <Link
      href={`/${user?.slug}/followers`}
      className="flex items-center gap-1 cursor-pointer"
    >
      <span className="font-semibold text-white">{followers.length}</span>
      <p className="text-text_3 hover:underline hover:text-white">Followers</p>
    </Link>
  );
};

export default UserFollowers;
