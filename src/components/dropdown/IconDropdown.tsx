import { IconDropdownProps } from "@/types/general.types";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { BsThreeDots } from "react-icons/bs";
/* ====================================================== */

const IconDropdown = ({
  editItem,
  data,
  deleteItem,
  editText = "Edit comment",
  deleteText = " Delete comment",
}: IconDropdownProps) => {
  return (
    <div className="flex items-center justify-end flex-1 flex-shrink-0">
      <Dropdown className=" bg-secondaryDark">
        <DropdownTrigger>
          <span className="flex items-center justify-center w-[35px] h-[35px] text-xl bg-text_2 rounded-full hover:bg-primaryColor cursor-pointer">
            <BsThreeDots />
          </span>
        </DropdownTrigger>
        <DropdownMenu color="primary" aria-label="Static Actions">
          <DropdownItem
            onClick={() => editItem(data)}
            className="hover:bg-primaryColor"
          >
            {editText}
          </DropdownItem>
          <DropdownItem
            onClick={() => deleteItem(data)}
            className="text-danger"
            color="danger"
          >
            {deleteText}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default IconDropdown;
