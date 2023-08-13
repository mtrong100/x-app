import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import FileInput from "../input/FileInput";
import useUploadImages from "@/hooks/useUploadImages";
/* ====================================================== */

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ModalPost = ({ isOpen, onClose, children }: ModalProps) => {
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useUploadImages();

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
              <ModalHeader className="flex flex-col gap-1 text-xl  text-white font-semibold">
                Create new post
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
              <ModalFooter className=" flex items-center justify-between">
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
                  <Button color="primary" onPress={onClose}>
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

export default ModalPost;
