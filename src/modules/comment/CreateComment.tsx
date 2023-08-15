import React, { useEffect, useState } from "react";
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
import { CloseIcon } from "@/components/icons/Icon";
import useTextareaChange from "@/hooks/useTextareaChange";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import useUploadImage from "@/hooks/useUploadImage";
import Loading from "@/components/loading/Loading";
import { formatDateTime } from "@/utils/reuse-function";
import CommentList from "./CommentList";
import useToggle from "@/hooks/useToggleValue";
/* ====================================================== */

type TUserData = {
  email: string;
  username: string;
  role: "user" | "admin";
  slug: string;
  photoURL: string;
  createdAt: any;
};

const CreateComment = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { postItemData: currentPost } = useAppSelector((state) => state.post);
  const date = formatDateTime(currentPost.createdAt);
  const [postOwner, setPostOwner] = useState<TUserData>({
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: null,
  });

  /* ========================= Custom hooks =====>> */
  // useUploadImage hook
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useUploadImage();

  // useTextareaChange hook
  const {
    handleChange,
    inputVal: commentVal,
    setInputVal: setCommentVal,
  } = useTextareaChange();

  // useToggle hook
  const { toggleValue: isInputFocused, setToggleValue: setIsInputFocused } =
    useToggle();

  // Fetch data of post owner
  useEffect(() => {
    async function fetchPostOwner() {
      if (!currentPost.userId) return;
      const userDocRef = doc(db, "users", currentPost.userId);
      const userDocSnap = await getDoc(userDocRef);
      const data = userDocSnap.data();
      if (data) {
        setPostOwner({
          email: data.email,
          username: data.username,
          role: data.role,
          slug: data.slug,
          photoURL: data.photoURL,
          createdAt: data.createdAt,
        });
      }
    }
    fetchPostOwner();
  }, [currentPost.userId]);

  // Create new comment
  const createComment = async () => {
    if (!currentPost.postId && !user.uid) return;
    if (!commentVal.trim()) return;
    const commentRef = collection(db, "posts", currentPost?.postId, "comments");
    await addDoc(commentRef, {
      comment: commentVal,
      commentImg: image,
      postId: currentPost.postId,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setCommentVal("");
    setImage("");
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
              <ModalBody className="gap-0">
                <div className="relative flex items-start gap-3 pb-3">
                  <div className="w-[45px] border-2 border-primaryColor h-[45px] rounded-full flex-shrink-0 select-none">
                    <Image
                      className="rounded-full select-none img-cover"
                      src={
                        postOwner?.photoURL ||
                        "https://source.unsplash.com/random"
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
                        {postOwner?.username}
                      </Link>
                      <span className="text-sm text-text_4">{`@${postOwner?.slug}`}</span>
                      <span className="text-lg font-bold">.</span>
                      <span className="text-sm text-text_4">{date}</span>
                    </div>
                    <p className="mt-1 text-base">{currentPost?.content}</p>
                    <div
                      className={`${
                        currentPost?.photos.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2"
                      } grid gap-1 mt-2`}
                    >
                      {currentPost?.photos &&
                        currentPost?.photos.length > 0 &&
                        currentPost?.photos.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-full h-full rounded-lg"
                          >
                            <Image
                              priority
                              src={image}
                              width={250}
                              height={250}
                              alt="user-avatar"
                              className="rounded-lg img-cover"
                            />
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                      <span className="text-text_3">Replying to</span>
                      <span className=" text-primaryColor">{`@${postOwner?.slug}`}</span>
                    </div>
                  </div>
                  {/* Line */}
                  <div className="absolute top-0 translate-x-5 -z-10 w-[2px] rounded-full h-full bg-text_3"></div>
                </div>

                {/* Add comment here */}
                <section className="flex flex-col gap-4">
                  <div className="relative flex items-start w-full gap-3 pb-3">
                    <div className="w-[45px] border-2 border-primaryColor h-[45px] rounded-full flex-shrink-0 select-none">
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

                    {/* User comment here */}
                    <div
                      className={`${
                        isInputFocused
                          ? "border-primaryColor"
                          : "border-transparent"
                      } relative w-full min-h-[88px] border-2 bg-secondaryDark p-3 rounded-lg`}
                    >
                      <TextareaAutosize
                        value={commentVal}
                        onChange={handleChange}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className="w-full mb-2 bg-transparent outline-none resize-none placeholder:text-text_3"
                        placeholder="Post your reply..."
                      />
                      {!image && progress === 0 && <></>}
                      {progress !== 0 && !image && (
                        <Loading fullHeight={false} />
                      )}
                      {image && (
                        <div className="relative w-fit">
                          <Image
                            priority
                            src={image}
                            width={250}
                            height={250}
                            alt="image-from-user"
                            className="object-contain rounded-lg"
                          />
                          <span
                            onClick={() => handleDeleteImage(image)}
                            className="circle-icon"
                          >
                            <CloseIcon />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Upload image & post comment */}
                <div className="flex items-center justify-end gap-3">
                  <FileInput
                    multiple={false}
                    handleSelectImage={handleSelectImage}
                  />
                  <Button
                    onClick={createComment}
                    className="text-white rounded-lg bg-primaryColor"
                  >
                    Post
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter className="py-0">
                <section className="w-full ">
                  <h2 className="mb-5 font-semibold border-b xl:text-2xl text-cloudGray border-text_2">
                    Other comments
                  </h2>
                  <CommentList postId={currentPost?.postId} />
                </section>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateComment;
