import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
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
/* ====================================================== */

const CreatePost = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { images, setImages, progress, handleSelectImage, handleDeleteImage } =
    useUploadImages();
  const { handleChange, inputVal, setInputVal } = useTextareaChange();

  // Create new post
  const createPost = async () => {
    if (!inputVal.trim() || !images) return;

    const postRef = collection(db, "posts");
    const newPostDoc = await addDoc(postRef, {
      content: inputVal,
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

  return (
    <>
      <Modal
        size="2xl"
        className="bg-primaryDark"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
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
                Create your new post
              </ModalHeader>
              <ModalBody>
                <div className="flex items-start h-full gap-3">
                  <div className="w-[38px] h-[38px] rounded-full flex-shrink-0">
                    <Image
                      src="/default-avatar.jpg"
                      width={100}
                      height={100}
                      alt="user-avatar"
                      className="rounded-full img-cover"
                    />
                  </div>
                  <textarea
                    className="textareaStyle"
                    placeholder="What is going on!"
                    onChange={handleChange}
                    value={inputVal}
                  ></textarea>
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
    </>
  );
};

export default CreatePost;
