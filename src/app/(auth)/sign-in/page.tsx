"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "@/components/button/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField, { InputPasswordToggle } from "@/components/input/Input";
import { InputTypes } from "@/types/general.types";
import LoginWithGoogle from "@/components/login-method/LoginWithGoogle";
import LoginWithGithub from "@/components/login-method/LoginWithGithub";
/* ====================================================== */

const SiginPage = () => {
  const { handleSubmit, control } = useForm<InputTypes>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<InputTypes> = (data) => {
    console.log(data);
  };

  return (
    <div className="h-screen  flex items-center justify-center w-full ">
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
        <h1 className="mt-3 mb-2 font-bold text-3xl capitalize">Sign in</h1>
        <p>Continue with...</p>
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
              No account?{" "}
              <Link
                href="/sign-up"
                className="text-primaryColor hover:underline"
              >
                Sign up
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

export default SiginPage;
