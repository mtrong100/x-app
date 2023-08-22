import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { storedUserData } from "@/redux/features/userSlice";
import { db } from "@/utils/firebase";
/* ====================================================== */

const useFetchUserSlug = () => {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchUser() {
      if (!slug) return;
      const userDocRef = query(
        collection(db, "users"),
        where("slug", "==", slug)
      );
      const querySnapshot = await getDocs(userDocRef);
      querySnapshot.forEach((doc: any) => {
        const userData = doc.data();
        if (userData) {
          dispatch(storedUserData({ ...userData }));
        }
      });
    }
    fetchUser();
  }, [dispatch, slug]);
};

export default useFetchUserSlug;
