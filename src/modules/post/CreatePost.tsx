import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import FileInput from "@/components/input/FileInput";
import useUploadImages from "@/hooks/useUploadImages";
import { CircularProgress } from "@nextui-org/react";
import useTextareaChange from "@/hooks/useTextareaChange";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";
import ImageDisplay from "@/components/image/ImageDisplay";
import UserAvatar from "../user/UserAvatar";
import TextareaAutosize from "react-textarea-autosize";
import { useRouter } from "next/navigation";
import { ModalProps } from "@/types/general.types";
/* ====================================================== */

const CreatePost = ({ isOpen, onClose, onOpenChange }: ModalProps) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { images, setImages, progress, handleSelectImage, handleDeleteImage } =
    useUploadImages();
  const { handleChange, inputVal, setInputVal } = useTextareaChange();

  const [modalPlacement, setModalPlacement] = React.useState<
    "center" | "auto" | "top" | "top-center" | "bottom" | "bottom-center"
  >("center");
  const [scrollBehavior, setScrollBehavior] = React.useState<
    "outside" | "inside" | "normal"
  >("outside");

  // Create new post
  const createPost = async () => {
    if (!user || !user.email) {
      router.push("/sign-in");
    }
    if (!inputVal.trim() || !images) return;

    // Replace newline characters with <br> tags
    const formatValue = inputVal.replace(/\n/g, "<br>");

    const postRef = collection(db, "posts");
    const newPostDoc = await addDoc(postRef, {
      content: formatValue,
      photos: images,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    // update postId in document
    const newPostId = newPostDoc.id;
    const postDocRef = doc(db, "posts", newPostId);
    await updateDoc(postDocRef, {
      postId: newPostId,
    });

    setInputVal("");
    setImages([]);
    toast.success("New post ahead!", {
      position: "top-center",
      theme: "dark",
      autoClose: 1500,
      pauseOnHover: false,
    });
  };

  // Check screen size
  const checkScreenSize = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      setModalPlacement("top-center");
      setScrollBehavior("outside");
    } else {
      setModalPlacement("center");
      setScrollBehavior("inside");
    }
  }, []);

  // Check screen for modal
  useEffect(() => {
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [checkScreenSize]);

  return (
    <Modal
      placement={modalPlacement}
      scrollBehavior={scrollBehavior}
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      className=" bg-primaryDark"
      backdrop="blur"
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
              Create your new post
            </ModalHeader>
            <ModalBody>
              <div className="items-start h-full gap-3 md:flex">
                <div className="flex items-center gap-3 pb-5">
                  <UserAvatar avatar={user?.photoURL} />
                  <span className="text-lg font-semibold text-white md:hidden">
                    {user?.username}
                  </span>
                </div>
                <TextareaAutosize
                  className="textareaStyle"
                  placeholder="What is going on!"
                  onChange={handleChange}
                  value={inputVal}
                />
              </div>
              <ImageDisplay images={images} onClick={handleDeleteImage} />
              {progress === 0 && images.length === 0 && <></>}
              {progress !== 0 && images.length === 0 && (
                <div className="flex items-center justify-center py-2">
                  <CircularProgress
                    size="lg"
                    color="danger"
                    strokeWidth={1}
                    label="Loading..."
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex items-center justify-between">
              <FileInput handleSelectImage={handleSelectImage} />
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
                  onClick={createPost}
                  className="text-white bg-primaryColor"
                  onPress={onClose}
                >
                  Post
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreatePost;
