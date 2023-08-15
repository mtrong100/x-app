import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useAppSelector } from "@/redux/store";
import useToggle from "@/hooks/useToggleValue";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import useUploadImage from "@/hooks/useUploadImage";
import Loading from "@/components/loading/Loading";
import { CloseIcon } from "@/components/icons/Icon";
import useTextareaChange from "@/hooks/useTextareaChange";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import FileInput from "@/components/input/FileInput";
/* ====================================================== */

const ToggleComment = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { commentItemData: cmtData } = useAppSelector((state) => state.post);

  /* ========================= Custom hooks =====>> */
  // useToggle hook
  const { toggleValue: isInputFocused, setToggleValue: setIsInputFocused } =
    useToggle();

  // useUploadImage hook
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useUploadImage();

  // useTextareaChange hook
  const {
    handleChange,
    inputVal: commentVal,
    setInputVal: setCommentVal,
  } = useTextareaChange();

  // Reset comment value
  useEffect(() => {
    if (cmtData?.comment || cmtData?.commentImg) {
      setCommentVal(cmtData?.comment);
      setImage(cmtData?.commentImg);
    }
  }, [cmtData?.comment, cmtData?.commentImg, setCommentVal, setImage]);

  // Delete comment
  const deleteComment = async () => {
    if (!cmtData?.postId && !cmtData?.commentId) return;
    const commentDocRef = doc(
      db,
      "posts",
      cmtData?.postId,
      "comments",
      cmtData?.commentId
    );
    await deleteDoc(commentDocRef);
    onClose();
  };

  // Update comment
  const updateComment = async () => {
    if (!cmtData?.postId && !cmtData?.commentId) return;
    const commentDocRef = doc(
      db,
      "posts",
      cmtData?.postId,
      "comments",
      cmtData?.commentId
    );
    await updateDoc(commentDocRef, {
      comment: commentVal,
      commentImg: image,
    });
    onClose();
  };

  return (
    <>
      <Modal
        size="xl"
        className="bg-primaryDark"
        backdrop="opaque"
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
              <ModalHeader className="flex flex-col gap-1">
                Update or Delete comment
              </ModalHeader>
              <ModalBody>
                {/* Add comment here */}
                <section className="flex flex-col gap-4">
                  <div className="relative flex items-start w-full gap-3 pb-3">
                    <div className="w-[45px] h-[45px] rounded-full flex-shrink-0 select-none">
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
                        placeholder="Update your reply..."
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
              </ModalBody>
              <ModalFooter className="flex items-center justify-between">
                <FileInput handleSelectImage={handleSelectImage} />
                <div className="flex items-center gap-2">
                  <Button
                    color="danger"
                    variant="solid"
                    onClick={deleteComment}
                  >
                    Delete
                  </Button>
                  <Button color="primary" onPress={updateComment}>
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

export default ToggleComment;
