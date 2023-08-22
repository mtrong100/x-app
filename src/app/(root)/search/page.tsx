"use client";
import UserItem, { UserItemSkeleton } from "@/modules/user/UserItem";
import Searchbar from "@/components/search/Searchbar";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { UserDataTypes } from "@/types/general.types";
import { useDispatch } from "react-redux";
import { db } from "@/utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { AppDispatch, useAppSelector } from "@/redux/store";
/* ====================================================== */

const SearchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [userList, setUserList] = useState<UserDataTypes[]>([]);
  const [searchVal, setSearchVal] = useState("");

  // Get users
  useEffect(() => {
    setLoading(true);
    const userRef = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      let results: UserDataTypes[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as UserDataTypes;
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      setUserList(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Filter the current user
  const filterCurrentUser = userList.filter(
    (user) => user.uid !== currentUser.uid
  );

  // Search user
  const filteredUser = filterCurrentUser.filter((item) =>
    item.username.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <section className="p-5">
      <Searchbar
        handeSearchQuery={(e) => setSearchVal(e.target.value)}
        query={searchVal}
        className="py-3"
      />
      <div className="flex flex-col gap-2 py-5">
        {loading &&
          Array(5)
            .fill(0)
            .map(() => <UserItemSkeleton color="third" key={v4()} />)}

        {!loading &&
          filteredUser.length > 0 &&
          filteredUser.map((item) => <UserItem data={item} key={item.uid} />)}
      </div>
    </section>
  );
};

export default SearchPage;
