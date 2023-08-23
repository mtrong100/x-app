import { TSavePost } from "@/types/general.types";
import React, { useEffect, useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
/* ====================================================== */

const SavePost = ({ postId, userId }: { postId: string; userId: string }) => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [userSavePost, setUserSavePost] = useState<TSavePost[]>([]);

  // Get user save post
  useEffect(() => {
    if (!currentUser.uid) return;
    const colRef = collection(db, "users", currentUser?.uid, "save");
    onSnapshot(colRef, (snapshot) => {
      let results: TSavePost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TSavePost;
        if (data) {
          results.push({
            ...data,
          });
        }
      });
      setUserSavePost(results);
    });
  }, [currentUser.uid]);

  // Handle toggle save post
  const toggleSave = async (postId: string) => {
    if (!currentUser || !currentUser.email) {
      router.push("/sign-in");
    }
    if (!currentUser.uid) return;
    const savePostDoc = doc(db, "posts", postId, "save", currentUser.uid);
    const savePostDocRef = doc(db, "users", currentUser?.uid, "save", postId);

    const saveSnap = await getDoc(savePostDoc);
    const saveDocSnap = await getDoc(savePostDocRef);

    if (saveSnap.exists() && saveDocSnap.exists()) {
      await Promise.all([deleteDoc(savePostDoc), deleteDoc(savePostDocRef)]);
    } else {
      await Promise.all([
        setDoc(savePostDoc, {
          uid: currentUser.uid,
          isSaved: true,
        }),
        setDoc(savePostDocRef, {
          userId: userId,
          postId: postId,
          isSaved: true,
        }),
      ]);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 ">
      {userSavePost.some((item) => item.postId === postId) ? (
        <span
          onClick={() => toggleSave(postId)}
          className="flex items-center justify-center w-8 h-8 text-base rounded-full cursor-pointer text-primaryColor hover:bg-primaryColor hover:bg-opacity-20 hover:text-primaryColor"
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
