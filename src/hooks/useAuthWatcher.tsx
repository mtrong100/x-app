import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/redux/features/authSlice";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { UserDataTypes } from "@/types/general.types";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { AppDispatch } from "@/redux/store";
/* ====================================================== */

const useAuthWatcher = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = query(
          collection(db, "users"),
          where("email", "==", user?.email)
        );
        const snapshot = await getDocs(docRef);
        snapshot.forEach((doc) => {
          const userData = doc.data() as UserDataTypes;
          if (userData) {
            dispatch(setUser({ ...userData }));
          }
        });
      } else {
        dispatch(clearUser());
        router.push("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);
};

export default useAuthWatcher;
