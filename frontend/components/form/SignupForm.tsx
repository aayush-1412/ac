"use client";
import React from "react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { Button } from "../ui/button";
import NotificationManager from "../../lib/toastSettings";

export function SignupForm() {
  const router = useRouter();
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      fullname,
      password,
      email,
      confirmPassword,
    };
    if (password != confirmPassword) {
      NotificationManager.showError("Passwords do not match");
      return;
    }
    const notification = NotificationManager.showLoading("Registering user...");
    try {
      const response = await api.post("/signup", formData);
      console.log(response.data);
      if (response.data.message === "success") {
        NotificationManager.updateLoadingToast(
          notification,
          "Registered! PLease login to continue",
          1
        );
        router.push("/login");
      } else {
        NotificationManager.updateLoadingToast(
          notification,
          "Error occured, please try after some time!",
          0
        );
      }
     
    } catch (err: any) {
      console.log(err);
      NotificationManager.updateLoadingToast(notification, err.response, 0);
    }
    console.log("Form submitted");
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to AC blog
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Register
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Fullname</Label>
            <Input
              name="fullname"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              id="firstname"
              placeholder="Tyler"
              type="text"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <div
          onClick={() => router.push("/login")}
          className="text-neutral-600 text-sm max-w-sm mt-4  dark:text-neutral-300 cursor-pointer flex justify-center items-center"
        >
          Already have an account? Login here
        </div>
        <div className="flex justify-center items-center m-4">
        <div className="flex justify-center items-center m-4">
              <div onClick={() => router.push("/")} className="text-neutral-800 text-sm max-w-sm mt-4  dark:text-neutral-300 cursor-pointer flex justify-center items-center">
                Back To Home
              </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
