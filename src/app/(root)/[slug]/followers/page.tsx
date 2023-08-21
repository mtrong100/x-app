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

const FollowersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts: postList } = useAppSelector((state) => state.post);
  const { userData: user, followers } = useAppSelector((state) => state.user);
  const [userList, setUserList] = useState<UserDataTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFollowers = async () => {
      if (!followers) return;

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
        followers.some((item) => item.uid === user.uid)
      );

      setUserList(filteredUsers);
      setLoading(false);
    };
    fetchUserFollowers();
  }, [dispatch, followers]);

  return (
    <>
      <Header username={user?.username} amount={postList.length} />
      <div className="flex flex-col gap-2 p-5">
        {loading &&
          Array(5)
            .fill(0)
            .map(() => <UserItemSkeleton color="third" key={v4()} />)}

        {!loading &&
          userList.length > 0 &&
          userList.map((item) => <UserItem data={item} key={item.uid} />)}
      </div>
    </>
  );
};

export default FollowersPage;
