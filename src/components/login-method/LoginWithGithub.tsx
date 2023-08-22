import slugify from "slugify";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGithub } from "react-icons/fa";
import { auth, db } from "@/utils/firebase";
import { ArrowrightIcon } from "../icons/Icon";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
/* ====================================================== */

const LoginWithGithub = () => {
  const provider = new GithubAuthProvider();
  const router = useRouter();

  const githubLogin = async () => {
    try {
      const results = await signInWithPopup(auth, provider);
      const data = results.user;
      if (!data || !data.uid) return;

      const userDocRef = doc(db, "users", data.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userDocData = userDocSnapshot.data();
        await updateDoc(userDocRef, {
          uid: data.uid,
          username: userDocData?.username,
          slug: userDocData?.slug,
          email: userDocData?.email,
          photoURL: userDocData?.photoURL,
          wallpaper: userDocData?.wallpaper,
          role: userDocData?.role,
        });
      } else {
        await setDoc(doc(db, "users", data.uid), {
          uid: data.uid,
          username: data.displayName,
          slug: slugify(data.displayName || "", { lower: true }),
          email: data.email,
          photoURL: data.photoURL,
          wallpaper: "https://source.unsplash.com/random",
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
      onClick={githubLogin}
      className="flex items-center justify-between p-3 transition-all border rounded-lg cursor-pointer group hover:bg-darkHover border-text_2"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          <FaGithub />
        </span>
        <p>Continue with Github</p>
      </div>
      <span className="invisible transition-all duration-300 -translate-x-5 group-hover:visible group-hover:translate-x-0">
        <ArrowrightIcon />
      </span>
    </div>
  );
};

export default LoginWithGithub;
