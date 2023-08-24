"use client";
import { AppDispatch, useAppSelector } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { storedFollowers } from "@/redux/features/userSlice";
import { TFollow, UserDataTypes } from "@/types/general.types";
import { UserItemSkeleton } from "@/modules/user/UserItem";
import { v4 } from "uuid";
import UserAvatar from "@/modules/user/UserAvatar";
import Link from "next/link";
/* ====================================================== */

const NotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { followers: data } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserDataTypes[]>([]);

  useEffect(() => {
    if (!currentUser.uid) return;
    const followersRef = collection(db, "users", currentUser.uid, "followers");
    const unsubscribe = onSnapshot(followersRef, (snapshot) => {
      let results: any = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      dispatch(storedFollowers(results));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid, dispatch]);

  useEffect(() => {
    async function getUserFollow() {
      if (!data) return;
      setLoading(true);

      const userRef = collection(db, "users");
      const snapshot = await getDocs(userRef);
      const allUsers: UserDataTypes[] = [];
      snapshot.forEach((docRef) => {
        const userData = docRef.data() as UserDataTypes;
        if (userData) {
          allUsers.push({
            ...userData,
          });
        }
      });

      allUsers.sort((a, b) => a.createdAt - b.createdAt);

      const filteredUsers = allUsers.filter((user) =>
        data.some((item: TFollow) => item.uid === user.uid)
      );

      setUsers(filteredUsers);
      setLoading(false);
    }
    getUserFollow();
  }, [data]);

  return (
    <section className="h-screen">
      <header className="flex items-center gap-2 p-5 text-lg font-medium bg-secondaryDark">
        New notifications
        <span className="text-2xl">
          <MdOutlineNotificationsActive />
        </span>
      </header>

      <div className="flex flex-col gap-3 p-5">
        {loading &&
          Array(3)
            .fill(0)
            .map(() => <UserItemSkeleton color="secondary" key={v4()} />)}

        {users.length > 0 &&
          users.map((item: UserDataTypes) => (
            <NotificationItem key={v4()} data={item} />
          ))}
      </div>
    </section>
  );
};

const NotificationItem = ({ data }: { data: UserDataTypes }) => {
  return (
    <li className="flex items-center p-3 rounded-md hover:bg-slate-100 hover:bg-opacity-5">
      <div className="flex items-center gap-1">
        <div className="flex items-center flex-1 gap-2">
          <UserAvatar avatar={data?.photoURL} />
          <Link
            href={`/${data?.slug}`}
            className="text-sm font-semibold text-white cursor-pointer hover:underline truncate-text"
          >
            {data?.username}
          </Link>
        </div>
        <p>Followed you</p>
      </div>
    </li>
  );
};

export default NotificationPage;
