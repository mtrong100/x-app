"use client";
import slugify from "slugify";
import React from "react";
import LoginWithGoogle from "@/components/login-method/LoginWithGoogle";
import LoginWithGithub from "@/components/login-method/LoginWithGithub";
import Link from "next/link";
import InputField, { InputPasswordToggle } from "@/components/input/Input";
import Image from "next/image";
import Button from "@/components/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { TUserSignup } from "@/types/general.types";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignupValidation } from "@/utils/validate";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
/* ====================================================== */

const SigupPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<TUserSignup>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  /* User sign up */
  const onSubmit: SubmitHandler<TUserSignup> = async (data) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      const userRef = collection(db, "users");
      const newUser = await addDoc(userRef, {
        username: data.username,
        slug: slugify(data.username, { lower: true }),
        email: data.email,
        password: data.password,
        role: "user",
        photoURL: "https://i.imgur.com/2LDUDB6.jpeg",
        wallpaper: "https://source.unsplash.com/random",
        createdAt: serverTimestamp(),
      });

      // update userId in document
      const newUserId = newUser.id;
      const userDocRef = doc(db, "users", newUserId);
      await updateDoc(userDocRef, {
        uid: newUserId,
      });

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
    <div className="flex items-center justify-center w-full h-screen ">
      <div className="w-full max-w-sm gap-10 p-5 rounded-lg shadow-blurPrimary md:max-w-lg bg-secondaryDark">
        <Link href="/">
          <Image
            className="rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-darkHover"
            src="/logo.png"
            alt="x-logo"
            width={40}
            height={40}
          />
        </Link>
        <h1 className="mt-5 mb-2 text-3xl font-bold">Create your account</h1>
        <p>Or continue with</p>
        <div className="flex flex-col w-full gap-3 mt-5">
          <LoginWithGoogle />
          <LoginWithGithub />
        </div>

        {/* Seperate */}
        <div className="w-full relative my-5 h-[1px] bg-text_3">
          <span className="absolute top-0 px-2 bg-secondaryDark left-2/4 -translate-x-2/4 -translate-y-2/4">
            Or
          </span>
        </div>

        {/* Main form */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="username"
            control={control}
            placeholder="Enter your username"
          />
          {errors.username?.message && (
            <p className="text-sm font-medium text-red-500">
              {errors.username?.message}
            </p>
          )}
          <InputField
            name="email"
            control={control}
            placeholder="Enter your email"
          />
          {errors.email?.message && (
            <p className="text-sm font-medium text-red-500">
              {errors.email?.message}
            </p>
          )}
          <InputPasswordToggle
            placeholder="Enter your password"
            name="password"
            control={control}
          ></InputPasswordToggle>
          {errors.password?.message && (
            <p className="text-sm font-medium text-red-500">
              {errors.password?.message}
            </p>
          )}
          <div className="mt-1">
            <p className="text-sm font-medium text-opacity-50">
              Have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primaryColor hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
          <Button
            variant="primary"
            className="w-full mt-4 uppercase"
            type="submit"
          >
            continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SigupPage;
