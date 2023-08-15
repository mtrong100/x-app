import { useState } from "react";
import {
  UploadTaskSnapshot,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function useUploadImage() {
  const [progress, setProgress] = useState<number>(0);
  const [image, setImage] = useState<string>("");

  const handleUploadImage = (file: File) => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, "pictures/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (error) => {
        console.log(error);
        setImage("");
        setProgress(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
          setProgress(0);
        });
      }
    );
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    handleUploadImage(file);
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      setImage("");
      setProgress(0);

      const storage = getStorage();
      const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
      const imageName = imageRegex?.[1];

      if (imageName) {
        const imageRef = ref(storage, "pictures/" + imageName);
        await deleteObject(imageRef);
      }
    } catch (error) {
      setImage("");
      console.log(error);
    }
  };

  return {
    image,
    setImage,
    progress,
    handleSelectImage,
    handleDeleteImage,
  };
}
