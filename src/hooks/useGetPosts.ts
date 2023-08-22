import { setPosts } from "@/redux/features/postSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { TPostData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

interface Props {
  userUID: string;
  setLoading: (loading: boolean) => void;
}

export const useGetPosts = ({ userUID, setLoading }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts: postList } = useAppSelector((state) => state.post);

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

    dispatch(setPosts(results));
    setLoading(false);
  }, [dispatch, setLoading, userUID]);

  return { postList, getPosts };
};
