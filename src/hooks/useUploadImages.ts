import { useState } from "react";
import {
  UploadTaskSnapshot,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function useUploadImages() {
  const [progress, setProgress] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  const handleUploadImage = (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, "pictures/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case "paused":
            console.log("paused");
            break;
          case "running":
            // Handle running
            break;
          default:
            // Handle other states
            break;
        }
      },
      (error) => {
        console.log(error);
        setImages([]);
        setProgress(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImages((prev) => [...prev, downloadURL]);
          setProgress(0);
        });
      }
    );
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    fileArray.forEach((file) => handleUploadImage(file));
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      const storage = getStorage();
      const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
      const imageName = imageRegex?.[1];

      if (imageName) {
        const imageRef = ref(storage, "pictures/" + imageName);
        await deleteObject(imageRef);
      }

      setImages((prevImages) =>
        prevImages.filter((image) => image !== imageUrl)
      );
      setProgress(0);
    } catch (error) {
      setImages([]);
      setProgress(0);
      console.log(error);
    }
  };

  return {
    images,
    setImages,
    progress,
    handleSelectImage,
    handleDeleteImage,
  };
}
