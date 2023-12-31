import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import useWallpaper from "@/hooks/useWallpaper";
import useUploadImage from "@/hooks/useUploadImage";
import UserWallpaper from "./UserWallpaper";
import UserAvatar from "./UserAvatar";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "@/redux/features/authSlice";
import { ModalProps } from "@/types/general.types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { AppDispatch, useAppSelector } from "@/redux/store";
/* ====================================================== */

const UpdateUser = ({ isOpen, onClose, onOpenChange }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [slug, setSlug] = useState("");

  /* Custom hooks */
  const { image, setImage, handleSelectImage: selectAvatar } = useUploadImage();
  const {
    wallpaper,
    setWallpaper,
    handleSelectImage: selectWallpaper,
  } = useWallpaper();

  // Fetch user data
  useEffect(() => {
    if (!currentUser.username && currentUser.slug) return;
    setUsername(currentUser.username);
    setSlug(currentUser.slug);
    setImage(currentUser?.photoURL);
    setWallpaper(currentUser?.wallpaper);
  }, [
    currentUser?.photoURL,
    currentUser.slug,
    currentUser.username,
    currentUser?.wallpaper,
    setImage,
    setWallpaper,
  ]);

  // Update user
  const updateUser = async () => {
    if (!username.trim() && !slug.trim()) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        username,
        slug: slugify(slug, { lower: true }),
        wallpaper: wallpaper,
        photoURL: image,
      });
      dispatch(
        setUser({
          ...currentUser,
          username,
          slug: slugify(slug, { lower: true }),
          wallpaper: wallpaper,
          photoURL: image,
        })
      );
      setUsername("");
      setSlug("");
      toast.success("Updated!", {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
        pauseOnHover: false,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        size="2xl"
        className="bg-primaryDark"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-semibold text-white">
                Update Infomation
              </ModalHeader>
              <ModalBody>
                <div className="relative">
                  <UserWallpaper
                    handleSelectImage={selectWallpaper}
                    wallpaper={wallpaper}
                    hasIcon={true}
                  />
                  <UserAvatar
                    handleSelectImage={selectAvatar}
                    hasIcon={true}
                    className="w-[140px] h-[140px] absolute bottom-0 translate-x-2/4 translate-y-2/4 -left-8 border-[5px] border-darkGraphite "
                    avatar={image}
                  />
                </div>
                <div className="flex flex-col gap-3 mt-20">
                  <input
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(e.target.value)
                    }
                    type="text"
                    placeholder="Enter your username..."
                    className="w-full p-4 text-sm bg-transparent border rounded-md outline-none focus:bg-darkGraphite border-text_2"
                  />
                  <input
                    value={slug}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSlug(e.target.value)
                    }
                    type="slug"
                    placeholder="Enter your slug..."
                    className="w-full p-4 text-sm bg-transparent border rounded-md outline-none focus:bg-darkGraphite border-text_2"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center gap-2">
                  <Button
                    color="danger"
                    variant="ghost"
                    className="mt-1"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={updateUser}
                    className="text-white bg-primaryColor"
                    onPress={onClose}
                  >
                    Update
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateUser;
