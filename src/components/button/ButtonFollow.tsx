import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useAppSelector } from "@/redux/store";
import { TFollow } from "@/types/general.types";
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
/* ====================================================== */

const ButtonFollow = ({ uid }: { uid: string }) => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [userFollowingList, setUserFollowingList] = useState<TFollow[]>([]);

  // Get "following" colRef from currentUser
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

  // Handle follow a user
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

  // Handle unfollow a user
  const unfollowUser = async (uid: string, currentUID: string) => {
    const followingDocRef = doc(db, "users", currentUID, "following", uid);
    const followersDocRef = doc(db, "users", uid, "followers", currentUID);
    await Promise.all([deleteDoc(followingDocRef), deleteDoc(followersDocRef)]);
  };

  // Toggle follow a user
  const toggleFollow = async (uid: string) => {
    if (!currentUser || !currentUser.email) {
      router.push("/sign-in");
    }
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
    <>
      {currentUser.uid !== uid && (
        <>
          {userFollowingList.some((item) => item.uid === uid) ? (
            <Button
              onClick={() => toggleFollow(uid)}
              variant="outline-secondary"
              className="text-sm text-white"
            >
              Following
            </Button>
          ) : (
            <Button
              onClick={() => toggleFollow(uid)}
              variant="secondary"
              className="text-sm"
            >
              Follow
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default ButtonFollow;
