import UserAvatar from "./UserAvatar";
import Skeleton from "@/components/loading/Skeleton";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/button/Button";
import { TFollow, UserDataTypes } from "@/types/general.types";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
/* ====================================================== */

interface UserItemProps {
  data: UserDataTypes;
}

const UserItem = ({ data }: UserItemProps) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [userFollowingList, setUserFollowingList] = useState<TFollow[]>([]);

  // Get user following
  useEffect(() => {
    if (!currentUser.uid) return;
    const colRef = collection(db, "users", currentUser?.uid, "following");
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
      setUserFollowingList(results);
    });
  }, [currentUser.uid]);

  // Handle Follow User
  const followUser = async (uid: string, currentUID: string) => {
    const followingDocRef = doc(db, "users", currentUID, "following", uid);
    const followersDocRef = doc(db, "users", uid, "followers", currentUID);
    await Promise.all([
      setDoc(followingDocRef, {
        uid,
        isFollowing: true,
      }),
      setDoc(followersDocRef, {
        uid: currentUID,
        isFollower: true,
      }),
    ]);
  };

  // Handle Unfollow User
  const unfollowUser = async (uid: string, currentUID: string) => {
    const followingDocRef = doc(db, "users", currentUID, "following", uid);
    const followersDocRef = doc(db, "users", uid, "followers", currentUID);
    await Promise.all([deleteDoc(followingDocRef), deleteDoc(followersDocRef)]);
  };

  // Toggle follow user
  const toggleFollow = async (uid: string) => {
    if (!uid && !currentUser.uid) return;
    try {
      const followingDocRef = doc(
        db,
        "users",
        currentUser.uid,
        "following",
        uid
      );
      const followingDocSnap = await getDoc(followingDocRef);
      if (followingDocSnap.exists()) {
        await unfollowUser(uid, currentUser?.uid);
      } else {
        await followUser(uid, currentUser?.uid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="flex items-center p-3 rounded-md hover:bg-slate-100 hover:bg-opacity-5">
      <div className="flex items-center flex-1 gap-3">
        <UserAvatar avatar={data?.photoURL} />
        <div className="flex flex-col flex-1 ">
          <Link
            href={`/${data?.slug}`}
            className="text-sm font-semibold text-white cursor-pointer hover:underline truncate-text"
          >
            {data?.username}
          </Link>
          <span className="text-xs text-text_4 truncate-text">{`@${data.slug}`}</span>
        </div>
      </div>
      {userFollowingList.some((item) => item.uid === data.uid) ? (
        <Button
          onClick={() => toggleFollow(data?.uid)}
          variant="outline-secondary"
          className="text-sm text-white"
        >
          Following
        </Button>
      ) : (
        <Button
          onClick={() => toggleFollow(data?.uid)}
          variant="secondary"
          className="text-sm"
        >
          Follow
        </Button>
      )}
    </li>
  );
};

export default UserItem;

export const UserItemSkeleton = () => {
  return (
    <li className="flex items-center p-3 rounded-md ">
      <div className="flex items-center flex-1 gap-2">
        <Skeleton
          bgcolor="secondary"
          className="w-[50px] h-[50px] rounded-full"
        />
        <div className="flex flex-col flex-1">
          <Skeleton bgcolor="secondary" className="h-5 w-28" />
          <Skeleton bgcolor="secondary" className="w-12 h-3 mt-2" />
        </div>
      </div>
      <Skeleton
        bgcolor="secondary"
        className="h-[32px] w-[82px] rounded-full"
      />
    </li>
  );
};
