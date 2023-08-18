import { PostActionProps, TSaveData } from "@/types/general.types";
import React, { useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAppSelector } from "@/redux/store";
/* ====================================================== */

const SavePost = ({ postId, userId }: PostActionProps) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [userSave, setUserSave] = useState<TSaveData>({
    id: "",
    postId: "",
    userId: "",
    isSaved: false,
  });

  // Get user's saved post
  useEffect(() => {
    if (!postId || !userId) return;
    const saveDocRef = doc(db, "posts", postId, "save", userId);
    const fetchUserSavePost = async () => {
      const saveDocSnap = await getDoc(saveDocRef);
      const saveDocData = saveDocSnap.data();
      if (saveDocData) {
        setUserSave(saveDocData as TSaveData);
      }
    };

    fetchUserSavePost();
  }, [postId, userId]);

  // Handle toggle save post
  const toggleSave = async (postId: string) => {
    if (!postId || !userId) return;

    const savePostRef = doc(db, "posts", postId, "save", userId);
    const saveDocRef = doc(db, "users", currentUser?.uid, "save", postId);

    const batch = writeBatch(db);

    try {
      const saveDocSnap = await getDoc(saveDocRef);
      const savePostSnap = await getDoc(savePostRef);

      if (saveDocSnap.exists() || savePostSnap.exists()) {
        batch.delete(saveDocRef);
        batch.delete(savePostRef);
      } else {
        const saveData = {
          postId: postId,
          userId: userId,
          isSaved: true,
        };
        const savePostData = {
          postId: postId,
          userId: currentUser?.uid,
          isSaved: true,
        };

        batch.set(saveDocRef, saveData);
        batch.set(savePostRef, savePostData);
      }

      await batch.commit();

      setUserSave((prev) => ({
        ...prev,
        isSaved: !prev?.isSaved,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 ">
      {userSave?.isSaved ? (
        <span
          onClick={() => toggleSave(postId)}
          className="flex items-center justify-center w-8 h-8 text-xl rounded-full text-primaryColor hover:bg-primaryColor hover:bg-opacity-20 hover:text-primaryColor "
        >
          <BsBookmarkFill />
        </span>
      ) : (
        <span
          onClick={() => toggleSave(postId)}
          className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-primaryColor hover:bg-opacity-30 hover:text-primaryColor"
        >
          <BsBookmark />
        </span>
      )}
    </div>
  );
};

export default SavePost;
