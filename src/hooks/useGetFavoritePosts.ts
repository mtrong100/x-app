import { setFavoritePosts } from "@/redux/features/postSlice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { TFavorite, TPostData } from "@/types/general.types";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
/* ====================================================== */

interface Props {
  data: TFavorite[];
  setLoading: (loading: boolean) => void;
}

export const useGetFavoritePosts = ({ data, setLoading }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { favoritePosts: favoriteList } = useAppSelector((state) => state.post);

  const getFavoriteList = useCallback(async () => {
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
      data.some((item: TFavorite) => item.postId === post.postId)
    );

    dispatch(setFavoritePosts(filteredPosts));
    setLoading(false);
  }, [data, dispatch, setLoading]);

  return { favoriteList, getFavoriteList };
};
