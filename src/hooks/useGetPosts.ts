import { TPostData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
/* ====================================================== */

interface Props {
  userUID: string;
  setLoading: (loading: boolean) => void;
}

export const useGetPosts = ({ userUID, setLoading }: Props) => {
  const [postList, setPostList] = useState<TPostData[]>([]);

  const getPosts = useCallback(async () => {
    if (!userUID) return;
    setLoading(true);

    const postRef = query(
      collection(db, "posts"),
      where("userId", "==", userUID),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(postRef);
    let results: TPostData[] = [];
    snapshot.forEach((doc) => {
      const postData = doc.data() as TPostData;
      if (postData) {
        results.push({
          ...postData,
        });
      }
    });

    setPostList(results);
    setLoading(false);
  }, [setLoading, userUID]);

  return { postList, getPosts };
};
