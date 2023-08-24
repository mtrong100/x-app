"use client";
import Header from "@/components/header/Header";
import UserItem, { UserItemSkeleton } from "@/modules/user/UserItem";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { UserDataTypes } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
/* ====================================================== */

const FollowingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts: postList } = useAppSelector((state) => state.post);
  const { userData: user, following } = useAppSelector((state) => state.user);
  const [userList, setUserList] = useState<UserDataTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFollowing = async () => {
      if (!following) return;

      const userRef = collection(db, "users");
      const snapshot = await getDocs(userRef);
      const allUsers: UserDataTypes[] = [];
      snapshot.forEach((userDoc) => {
        const data = userDoc.data() as UserDataTypes;
        if (data) {
          allUsers.push({
            ...data,
          });
        }
      });

      allUsers.sort((a, b) => b.createdAt - a.createdAt);

      // filtered user
      const filteredUsers = allUsers.filter((user) =>
        following.some((item) => item.uid === user.uid)
      );

      setUserList(filteredUsers);
      setLoading(false);
    };
    fetchUserFollowing();
  }, [dispatch, following]);

  return (
    <section className="h-screen">
      <Header
        className="hidden md:block"
        username={user?.username}
        amount={postList.length}
      />
      <div className="flex flex-col gap-2 p-5">
        {loading &&
          Array(5)
            .fill(0)
            .map(() => <UserItemSkeleton color="third" key={v4()} />)}

        {!loading &&
          userList.length > 0 &&
          userList.map((item) => <UserItem data={item} key={item.uid} />)}
      </div>
    </section>
  );
};

export default FollowingPage;
