import { setRepostPosts } from "@/redux/features/postSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { TPostData, TRepost } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
/* ====================================================== */

interface Props {
  data: TRepost[];
  setLoading: (loading: boolean) => void;
}

export const useGetRepostPosts = ({ data, setLoading }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { repostPosts: repostList } = useAppSelector((state) => state.post);

  const getRepostList = useCallback(async () => {
    if (!data) return;
    setLoading(true);

    const repostsRef = collection(db, "posts");
    const snapshot = await getDocs(repostsRef);
    const allPosts: TPostData[] = [];
    snapshot.forEach((postDoc) => {
      const postData = postDoc.data() as TPostData;
      if (postData) {
        allPosts.push({
          ...postData,
        });
      }
    });

    allPosts.sort((a, b) => a.createdAt - b.createdAt);

    const filteredPosts = allPosts.filter((post) =>
      data.some((item) => item.postId === post.postId)
    );

    dispatch(setRepostPosts(filteredPosts));
    setLoading(false);
  }, [data, dispatch, setLoading]);

  return { repostList, getRepostList };
};
