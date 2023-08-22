import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { collection, onSnapshot } from "firebase/firestore";
import { AppDispatch } from "@/redux/store";
import {
  storedRepostData,
  storedFavoriteData,
} from "@/redux/features/postSlice";
import { db } from "@/utils/firebase";
import { TRepost, TFavorite } from "@/types/general.types";
/* ====================================================== */

interface Props {
  active: string;
  userUID: string;
  setLoading: (loading: boolean) => void;
}

const useFetchTabData = ({ active, userUID, setLoading }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const dataKey = active === "reposts" ? "repost" : "favorite";

  useEffect(() => {
    if (!userUID || (active !== "reposts" && active !== "favorite")) return;

    const dataRef = collection(db, "users", userUID, dataKey);
    const unsubscribe = onSnapshot(dataRef, (snapshot) => {
      let results: (TFavorite | TRepost)[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TRepost | TFavorite;
        if (data) {
          results.push({
            ...data,
          });
        }
      });

      if (active === "reposts") {
        dispatch(storedRepostData(results as TRepost[]));
      } else if (active === "favorite") {
        dispatch(storedFavoriteData(results as TFavorite[]));
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [active, dataKey, dispatch, setLoading, userUID]);
};

export default useFetchTabData;
