import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import FileInput from "@/components/input/FileInput";
import useTextareaChange from "@/hooks/useTextareaChange";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { AppDispatch, useAppSelector } from "@/redux/store";
import TextareaAutosize from "react-textarea-autosize";
import useUploadImage from "@/hooks/useUploadImage";
import Loading from "@/components/loading/Loading";
import { formatDateTime } from "@/utils/reuse-function";
import CommentList from "./CommentList";
import useToggle from "@/hooks/useToggleValue";
import { useDispatch } from "react-redux";
import { setIsUpdateCmt, storedCommentData } from "@/redux/features/postSlice";
import UserAvatar from "../user/UserAvatar";
import UserMeta from "../user/UserMeta";
import ImageCmt from "@/components/image/ImageCmt";
import ImageDisplay from "@/components/image/ImageDisplay";
import { TComment } from "@/types/general.types";
import { toast } from "react-toastify";
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
  const dispatch = useDispatch<AppDispatch>();
  const { postItemData: currentPost } = useAppSelector((state) => state.post);
  const { commentItemData: cmtData, isUpdateCmt } = useAppSelector(
    (state) => state.post
  );
  const date = formatDateTime(currentPost.createdAt);
  const [updateCmt, setUpdateCmt] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [postOwner, setPostOwner] = useState<TUserData>({
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: null,
  });

  console.log(postOwner);

  /* ========================= Custom hooks =====>> */
  // useUploadImage hook
  const { image, setImage, progress, handleSelectImage } = useUploadImage();

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

  // Set current comment
  useEffect(() => {
    async function fetchCmt() {
      if (!cmtData?.postId || !cmtData?.commentId) return;
      const cmtDocRef = doc(
        db,
        "posts",
        cmtData?.postId,
        "comments",
        cmtData?.commentId
      );
      const cmtDocSnap = await getDoc(cmtDocRef);
      const data = cmtDocSnap.data();
      if (data) {
        setUpdateCmt(data.comment);
        setImage(data.commentImg);
      }
    }
    fetchCmt();
  }, [cmtData?.commentId, cmtData?.postId, setImage]);

  // Click outside modal to disable update comment
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        dispatch(setIsUpdateCmt(false));
        setImage("");
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [dispatch, setImage]);

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

  // Update comment
  const updateComment = async () => {
    if (!updateCmt.trim() || !image) return;
    const commentDocRef = doc(
      db,
      "posts",
      cmtData?.postId,
      "comments",
      cmtData?.commentId
    );

    try {
      await updateDoc(commentDocRef, {
        comment: updateCmt,
        commentImg: image,
      });

      // Fetch updated comment data after successful update
      const updatedCmtDocSnap = await getDoc(commentDocRef);
      const updatedData = updatedCmtDocSnap.data() as TComment;

      if (updatedData) {
        setUpdateCmt(updatedData.comment);
        setImage(updatedData.commentImg);
        dispatch(storedCommentData(updatedData));
      }

      dispatch(setIsUpdateCmt(false));
      setImage("");

      toast.success("Update successfully!", {
        position: "top-center",
        theme: "dark",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Reset comment when close
  const handleReset = () => {
    dispatch(setIsUpdateCmt(false));
    setImage("");
    onClose();
  };

  // Delete old image
  const handleDeleteImage = async (url: string) => {
    if (!cmtData?.postId || !cmtData?.commentId) return;
    const commentDocRef = doc(
      db,
      "posts",
      cmtData.postId,
      "comments",
      cmtData.commentId
    );

    try {
      const commentDoc = await getDoc(commentDocRef);
      if (commentDoc.exists()) {
        const commentData = commentDoc.data() as TComment;

        if (commentData && commentData.commentImg === url) {
          await updateDoc(commentDocRef, {
            commentImg: "",
          });

          setImage("");
          dispatch(
            storedCommentData({
              ...cmtData,
              commentImg: "",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
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
            <section ref={modalRef}>
              <ModalHeader className="flex flex-col gap-1 text-xl font-semibold text-white">
                Comments
              </ModalHeader>
              <ModalBody className="gap-0">
                <div className="relative flex items-start gap-3 pb-3">
                  <UserAvatar avatar={postOwner?.photoURL} />

                  <div className="flex-1">
                    <UserMeta
                      username={postOwner?.username}
                      slug={postOwner?.slug}
                      date={date}
                    />
                    <p className="mt-1 text-base">{currentPost?.content}</p>
                    <ImageDisplay
                      images={currentPost.photos}
                      hideIcon={false}
                    />
                    <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                      <span className="text-text_3">Replying to</span>
                      <span className=" text-primaryColor">{`@${postOwner?.slug}`}</span>
                    </div>
                  </div>

                  {/* Line */}
                  <div className="verical-line"></div>
                </div>

                {/* Add comment here */}
                <section className="flex flex-col gap-4">
                  <div className="relative flex items-start w-full gap-3 pb-3">
                    <UserAvatar avatar={user?.photoURL} />

                    {/* User comment here */}
                    <div
                      className={`${
                        isInputFocused || isUpdateCmt
                          ? "border-primaryColor"
                          : "border-transparent"
                      } relative w-full min-h-[88px] border-2 bg-secondaryDark p-3 rounded-lg`}
                    >
                      {isUpdateCmt ? (
                        <TextareaAutosize
                          value={updateCmt}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setUpdateCmt(e.target.value)}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          className="w-full mb-2 bg-transparent outline-none resize-none placeholder:text-text_3"
                          placeholder="Update your reply..."
                        />
                      ) : (
                        <TextareaAutosize
                          value={commentVal}
                          onChange={handleChange}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          className="w-full mb-2 bg-transparent outline-none resize-none placeholder:text-text_3"
                          placeholder="Post your reply..."
                        />
                      )}

                      {!image && progress === 0 && <></>}
                      {progress !== 0 && !image && (
                        <Loading fullHeight={false} />
                      )}
                      {image && (
                        <ImageCmt onClick={handleDeleteImage} image={image} />
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
                    color="danger"
                    variant="ghost"
                    className="mt-1"
                    onClick={handleReset}
                  >
                    Close
                  </Button>
                  {isUpdateCmt ? (
                    <Button color="primary" onClick={updateComment}>
                      Update
                    </Button>
                  ) : (
                    <Button
                      onClick={createComment}
                      className="text-white rounded-lg bg-primaryColor"
                    >
                      Post
                    </Button>
                  )}
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
            </section>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateComment;
