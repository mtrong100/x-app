import { UserMetaProps } from "@/types/general.types";
import Link from "next/link";
import React from "react";
/* ====================================================== */

const UserMeta = ({ username, slug, date }: UserMetaProps) => {
  return (
    <div className="flex items-center gap-1">
      <Link href="/" className="font-medium text-white hover:underline">
        {username}
      </Link>
      <span className="text-sm text-text_4">{`@${slug}`}</span>
      <span className="text-lg font-bold">.</span>
      <span className="text-sm text-text_4">{date}</span>
    </div>
  );
};

export default UserMeta;