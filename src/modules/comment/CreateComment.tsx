import React, { useEffect } from "react";
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
import { CloseIcon } from "@/components/icons/Icon";
import { CircularProgress } from "@nextui-org/react";
import useTextareaChange from "@/hooks/useTextareaChange";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";
import { Textarea } from "@nextui-org/react";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
/* ====================================================== */

const CreateComment = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { images, setImages, progress, handleSelectImage, handleDeleteImage } =
    useUploadImages();
  const { handleChange, inputVal, setInputVal } = useTextareaChange();
  const { user } = useAppSelector((state) => state.auth);

  // Create new post
  const createPost = async () => {
    const postRef = collection(db, "posts");
    await addDoc(postRef, {
      content: inputVal,
      photos: images,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setInputVal("");
    setImages([]);
    toast.success("New post ahead", {
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
                Comments
              </ModalHeader>
              <ModalBody>
                <div className="relative flex items-start gap-3">
                  <div className="w-[42px] hover:opacity-70 h-[42px] rounded-full flex-shrink-0 select-none">
                    <Image
                      className="rounded-full select-none img-cover"
                      src={
                        user?.photoURL || "https://source.unsplash.com/random"
                      }
                      width={500}
                      height={500}
                      alt="user-avatar"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <Link
                        href="/"
                        className="font-semibold text-white hover:underline"
                      >
                        {user?.username}
                      </Link>
                      <span className="text-sm text-text_4">{`@crowbar`}</span>
                      <span className="text-lg font-bold">.</span>
                      <span className="text-sm text-text_4">{`14/8/2023`}</span>
                    </div>
                    <p className="mt-1 text-base">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Porro voluptatem laboriosam magni nemo in. Beatae quisquam
                      autem, voluptatibus corporis veniam vel expedita magni
                      provident, sint voluptates explicabo placeat eligendi
                      ipsam!
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium">
                      <span className="text-text_3">Replying to</span>
                      <span className=" text-primaryColor">@Daydreamer</span>
                    </div>
                  </div>
                  {/* Line */}
                  <div className="absolute top-0 translate-x-5 translate-y-12 w-[2px] rounded-full h-[130px] bg-text_3"></div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col gap-4">
                <div className="flex items-start w-full gap-3 ">
                  <div className="w-[42px] hover:opacity-70 h-[42px] rounded-full flex-shrink-0 select-none">
                    <Image
                      className="rounded-full select-none img-cover"
                      src={
                        user?.photoURL || "https://source.unsplash.com/random"
                      }
                      width={500}
                      height={500}
                      alt="user-avatar"
                    />
                  </div>
                  <div className="relative w-full">
                    <TextareaAutosize
                      className="w-full mb-2 bg-transparent outline-none resize-none font-primary"
                      placeholder="Post your reply..."
                    />
                    <Image
                      className="object-contain w-full rounded-lg"
                      src={"https://source.unsplash.com/random"}
                      width={500}
                      height={500}
                      alt="user-avatar"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <FileInput handleSelectImage={handleSelectImage} />
                  <Button
                    onClick={createPost}
                    className="text-white rounded-lg bg-primaryColor"
                    onPress={onClose}
                  >
                    Post
                  </Button>
                </div>
                {/* <FileInput handleSelectImage={handleSelectImage} /> */}
                {/* <div className="flex items-center gap-2">
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
                </div> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateComment;
