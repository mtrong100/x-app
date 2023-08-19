import React, { ChangeEvent, useState } from "react";
import { SearchIcon } from "../icons/Icon";
import { SearchbarProps } from "@/types/general.types";

const Searchbar = ({
  className,
  query,
  handeSearchQuery = () => {},
}: SearchbarProps) => {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  return (
    <div
      className={`${
        isInputFocused ? "border-primaryColor" : "border-transparent"
      } ${className} flex items-center  w-full gap-3 py-2 px-3 rounded-full bg-primaryDark border`}
    >
      <SearchIcon />
      <input
        value={query}
        onChange={handeSearchQuery}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        className="w-full bg-transparent outline-none"
        type="text"
        placeholder="Search..."
      />
    </div>
  );
};

export default Searchbar;
