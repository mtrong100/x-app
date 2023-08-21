"use client";
import React, { useEffect, useState } from "react";
import { SearchIcon } from "../icons/Icon";
import Button from "../button/Button";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { UserDataTypes } from "@/types/general.types";
import { useDispatch } from "react-redux";
import { storedUsers } from "@/redux/features/userSlice";
import UserItem, { UserItemSkeleton } from "@/modules/user/UserItem";
import { v4 } from "uuid";
import Searchbar from "../search/Searchbar";
import { useRouter } from "next/navigation";
/* ====================================================== */

const RightSidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users: userList } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  // Get users
  useEffect(() => {
    setLoading(true);
    const userRef = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      let results: UserDataTypes[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          results.push({
            uid: doc.id,
            email: data.email,
            username: data.username,
            role: data.role,
            slug: data.slug,
            photoURL: data.photoURL,
            createdAt: data.createdAt,
          });
        }
      });
      dispatch(storedUsers(results));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const filterCurrentUser = userList.filter(
    (user) => user.uid !== currentUser.uid
  );

  return (
    <div className="sticky right-0 top-0 z-20 flex h-screen flex-col overflow-auto p-5 w-[380px]">
      <Searchbar />

      {/* Recommended user */}
      <div className="p-3 mt-5 rounded-md bg-primaryDark">
        <h1 className="text-lg font-bold text-cloudGray">Recommended</h1>
        <ul className="flex flex-col gap-3 mt-3">
          {loading &&
            Array(5)
              .fill(0)
              .map(() => <UserItemSkeleton color="secondary" key={v4()} />)}

          {filterCurrentUser.length > 0 &&
            filterCurrentUser.map((item) => (
              <UserItem data={item} key={item.uid} />
            ))}
          <Button
            onClick={() => router.push("/search")}
            className="rounded-full"
            variant="primary"
          >
            See more
          </Button>
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
