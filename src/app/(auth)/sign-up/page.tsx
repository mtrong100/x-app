"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ArrowrightIcon } from "@/components/icons/Icon";
import InputField, { InputPasswordToggle } from "@/components/input/Input";
import Button from "@/components/button/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { TUserSignup } from "@/types/general.types";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation } from "@/utils/validate";
import LoginWithGoogle from "@/components/login-method/LoginWithGoogle";
import LoginWithGithub from "@/components/login-method/LoginWithGithub";
import { createUserWithEmailAndPassword } from "firebase/auth";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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

  const onSubmit: SubmitHandler<TUserSignup> = async (data) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        username: data.username,
        slug: slugify(data.username, { lower: true }),
        email: data.email,
        password: data.password,
        role: "user",
        photoURL: "https://i.imgur.com/2LDUDB6.jpeg",
        createdAt: serverTimestamp(),
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
    <div className="h-screen flex items-center justify-center w-full ">
      <div className="w-full shadow-blurPrimary gap-10 md:max-w-lg bg-secondaryDark p-5 rounded-lg">
        <Link href="/">
          <Image
            className="rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-darkHover"
            src="/logo.png"
            alt="x-logo"
            width={40}
            height={40}
          />
        </Link>
        <h1 className="mt-5 mb-2 font-bold text-3xl">Create your account</h1>
        <p>Or continue with</p>
        <div className="w-full mt-5 flex flex-col gap-3">
          <LoginWithGoogle />
          <LoginWithGithub />
        </div>

        {/* Seperate */}
        <div className="w-full relative my-5 h-[1px] bg-text_3">
          <span className="absolute top-0 bg-secondaryDark px-2 left-2/4 -translate-x-2/4 -translate-y-2/4">
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
            <p className="text-sm text-red-500 font-medium">
              {errors.username?.message}
            </p>
          )}
          <InputField
            name="email"
            control={control}
            placeholder="Enter your email"
          />
          {errors.email?.message && (
            <p className="text-sm text-red-500 font-medium">
              {errors.email?.message}
            </p>
          )}
          <InputPasswordToggle
            placeholder="Enter your password"
            name="password"
            control={control}
          ></InputPasswordToggle>
          {errors.password?.message && (
            <p className="text-sm text-red-500 font-medium">
              {errors.password?.message}
            </p>
          )}
          <div className="mt-1">
            <p className="text-opacity-50 text-sm font-medium">
              Have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primaryColor hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
          <Button className="w-full uppercase mt-4" type="submit">
            continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SigupPage;
