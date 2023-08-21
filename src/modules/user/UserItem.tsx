import UserAvatar from "./UserAvatar";
import Skeleton from "@/components/loading/Skeleton";
import React from "react";
import Link from "next/link";
import { UserDataTypes } from "@/types/general.types";
import ButtonFollow from "@/components/button/ButtonFollow";
/* ====================================================== */

interface UserItemProps {
  data: UserDataTypes;
}

const UserItem = ({ data }: UserItemProps) => {
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
      <ButtonFollow uid={data.uid} />
    </li>
  );
};

export default UserItem;

export const UserItemSkeleton = ({
  color = "secondary",
}: {
  color: "secondary" | "primary" | "third";
}) => {
  return (
    <li className="flex items-center p-3 rounded-md">
      <div className="flex items-center flex-1 gap-2">
        <Skeleton bgcolor={color} className="w-[50px] h-[50px] rounded-full" />
        <div className="flex flex-col flex-1">
          <Skeleton bgcolor={color} className="h-5 w-28" />
          <Skeleton bgcolor={color} className="w-12 h-3 mt-2" />
        </div>
      </div>
      <Skeleton bgcolor={color} className="h-[32px] w-[82px] rounded-full" />
    </li>
  );
};
