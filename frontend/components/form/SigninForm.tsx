"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import Cookie from "js-cookie";
import { Button } from "../ui/button";
import NotificationManager from "@/lib/toastSettings";
export function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
    
    const notification = NotificationManager.showLoading("Logging In");
    if(!email || email==undefined || !password ||password==undefined){
      NotificationManager.updateLoadingToast(notification,"Email/password can't be empty",0)
    }
    try {
     
      const response = await api.post("/login", formData);
      console.log(response)
      
      if(response.data.message==="no user found")
        {
          NotificationManager.updateLoadingToast(notification,"Create Account first!",0)
          router.push('/register')
        }
      if (response.data.accessToken) {
        NotificationManager.updateLoadingToast(notification, "Logged in!", 1);
        const token = response.data.accessToken;
        const userId = response.data.userId;
        Cookie.set("token", token);
        Cookie.set("userId", userId);

        router.push("/dashboard");
      } else {
        NotificationManager.updateLoadingToast(
          notification,
          "Credentials don't match",
          0
        );
      }
    } catch (err: any) {
      console.log(err);
      NotificationManager.updateLoadingToast(notification, "Create an account first!", 0);
    }
  };
  return (
    <>
      <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black ">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Welcome Back to AC blog
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Login
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Log In &rarr;
              <BottomGradient />
            </button>

            <div
              onClick={() => router.push("/register")}
              className="text-neutral-600 text-sm max-w-sm mt-4  dark:text-neutral-300 cursor-pointer flex justify-center items-center"
            >
              New Here? Create an account
            </div>
            <div className="flex justify-center items-center m-4">
              <div onClick={() => router.push("/")} className="text-neutral-800 text-sm max-w-sm mt-4  dark:text-neutral-300 cursor-pointer flex justify-center items-center">
                Back To Home
              </div>
            </div>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          </form>
        </div>
      </div>
    </>
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
