import React from "react";
import { FcGoogle } from "react-icons/fc";
import { ArrowrightIcon } from "../icons/Icon";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import { toast } from "react-toastify";
import slugify from "slugify";
import { useRouter } from "next/navigation";
/* ====================================================== */

const LoginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const googleLogin = async () => {
    try {
      const results = await signInWithPopup(auth, provider);
      const data = results.user;
      if (!data || !data.uid) return;

      const userDocRef = doc(db, "users", data.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userDocData = userDocSnapshot.data();
        await updateDoc(userDocRef, {
          username: userDocData?.username,
          slug: userDocData?.slug,
          email: userDocData?.email,
          photoURL: userDocData?.photoURL,
          role: userDocData?.role,
        });
      } else {
        await setDoc(doc(db, "users", data.uid), {
          username: data.displayName,
          slug: slugify(data.displayName || "", { lower: true }),
          email: data.email,
          photoURL: data.photoURL,
          createdAt: serverTimestamp(),
          role: "user",
        });
      }
      toast.success("Welcome to X!", {
        theme: "dark",
        autoClose: 2000,
        pauseOnHover: false,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={googleLogin}
      className="flex items-center group transition-all justify-between hover:bg-darkHover cursor-pointer  border border-text_2 p-3 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          <FcGoogle />
        </span>
        <p>Continue with Google</p>
      </div>
      <span className=" -translate-x-5 transition-all invisible duration-300 group-hover:visible  group-hover:translate-x-0 ">
        <ArrowrightIcon />
      </span>
    </div>
  );
};

export default LoginWithGoogle;
