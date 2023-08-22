import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import FileInput from "@/components/input/FileInput";
import useUploadImages from "@/hooks/useUploadImages";
import { CircularProgress } from "@nextui-org/react";
import useTextareaChange from "@/hooks/useTextareaChange";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";
import { AppDispatch, useAppSelector } from "@/redux/store";
import UserAvatar from "../user/UserAvatar";
import { useDispatch } from "react-redux";
import { storedPostData } from "@/redux/features/postSlice";
import ImageDisplay from "@/components/image/ImageDisplay";
import { ModalProps, TPostData } from "@/types/general.types";
import TextareaAutosize from "react-textarea-autosize";
/* ====================================================== */

const UpdatePost = ({ isOpen, onClose }: ModalProps) => {
  const { images, setImages, progress, handleSelectImage } = useUploadImages();
  const dispatch = useDispatch<AppDispatch>();
  const { handleChange, inputVal, setInputVal } = useTextareaChange();
  const { user } = useAppSelector((state) => state.auth);
  const { postItemData: postData } = useAppSelector((state) => state.post);

  // Set post data
  useEffect(() => {
    async function fetchPost() {
      if (!postData?.postId) return;
      const postDocRef = doc(db, "posts", postData?.postId);
      const postDocSnap = await getDoc(postDocRef);
      const data = postDocSnap.data();
      if (data) {
        const formatContent = data.content.replace(/<br>/g, "");
        setInputVal(formatContent);
        setImages(data.photos);
      }
    }
    fetchPost();
  }, [postData?.postId, setImages, setInputVal]);

  // Delete old image
  const handleDeleteImage = async (url: string) => {
    if (!postData?.postId) return;
    const postDocRef = doc(db, "posts", postData?.postId);
    const filteredPhoto = postData?.photos.filter((item) => item !== url);
    try {
      await updateDoc(postDocRef, {
        photos: filteredPhoto,
      });
      setImages(filteredPhoto);
      dispatch(storedPostData({ ...postData, photos: filteredPhoto }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Update post
  const updatePost = async () => {
    if (!inputVal.trim() || !images) return;
    const postDocRef = doc(db, "posts", postData?.postId);

    try {
      await updateDoc(postDocRef, {
        content: inputVal,
        photos: images,
      });

      // Fetch updated post data after successful update
      const updatedPostDocSnap = await getDoc(postDocRef);
      const updatedData = updatedPostDocSnap.data() as TPostData;

      if (updatedData) {
        setInputVal(updatedData.content);
        setImages(updatedData.photos);
        dispatch(storedPostData(updatedData));
      }

      toast.success("Update successfully!", {
        position: "top-center",
        theme: "dark",
        autoClose: 1500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error updating post:", error);
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
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-semibold text-white">
                Update your post
              </ModalHeader>
              <ModalBody>
                <div className="flex items-start h-full gap-3">
                  <UserAvatar avatar={user?.photoURL} />
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
                    onClick={updatePost}
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

export default UpdatePost;
