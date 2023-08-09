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
import { InputTypes } from "@/types/general.types";
/* ====================================================== */

const SigupPage = () => {
  const { handleSubmit, control } = useForm<InputTypes>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<InputTypes> = (data) => {
    console.log(data);
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
          {/* Login with google */}
          <div className="flex items-center group transition-all justify-between hover:bg-darkHover cursor-pointer  border border-text_2 p-3 rounded-lg">
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
          {/* Login with github */}
          <div className="flex items-center group transition-all justify-between hover:bg-darkHover cursor-pointer  border border-text_2 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                <FaGithub />
              </span>
              <p>Continue with Google</p>
            </div>
            <span className=" -translate-x-5 transition-all invisible duration-300 group-hover:visible  group-hover:translate-x-0 ">
              <ArrowrightIcon />
            </span>
          </div>
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
          <InputField
            name="email"
            control={control}
            placeholder="Enter your email"
          />
          <InputPasswordToggle
            placeholder="Enter your password"
            name="password"
            control={control}
          ></InputPasswordToggle>
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
