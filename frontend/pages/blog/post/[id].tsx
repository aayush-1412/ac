"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import Cookie from "js-cookie";
import api from "@/lib/api";

import NotificationManager from "@/lib/toastSettings";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [blog, setBlog] = useState<BlogType>();

  useEffect(() => {
    const notification = NotificationManager.showLoading("Fetching post...");

    try {
      const token = Cookie.get("token");
      if (!token || token === undefined) {
        NotificationManager.updateLoadingToast(
          notification,
          "User not signed in!",
          0
        );
        router.push("/login");
      }

      const url = window.location.pathname;
      const parts = url.split("/");
      const extractedId = parts[parts.length - 1];
      console.log(extractedId);

      api
        .get(`/blog/post/${extractedId}`)
        .then((res) => {
          const blogData = res.data.post as BlogType[];
          if (blogData.length === 0) {
            NotificationManager.updateLoadingToast(
              notification,
              "Please refresh once!",
              0
            );
            return;
          }

          NotificationManager.updateLoadingToast(
            notification,
            "Blog fetched!",
            1
          );
          setBlog(res.data.post);
        })
        .catch((err) => {
          console.log(err);
          NotificationManager.updateLoadingToast(
            notification,
            "Unauthorised access! please Login",
            0
          );
        });
    } catch (err) {
      NotificationManager.updateLoadingToast(
        notification,
        "Error occured! See console",
        0
      );
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setBody(blog.body || "");
    }
  }, [blog]);

  const handleLogout = () => {
    const notification = NotificationManager.showLoading("Logging out...");

   
    try {
      const allCookies = Cookie.get(); 

      Object.keys(allCookies).forEach((cookie) => Cookie.remove(cookie));
      setTimeout(() => {
        NotificationManager.updateLoadingToast(
          notification,
          "Logged out successfully!",
          1
        );
        router.push("/login");
      }, 100);
    } catch (err) {
      NotificationManager.updateLoadingToast(
        notification,
        "Error logging out! Check console",
        0
      );
      console.log(err);
    }
  };

  const handleEdit = async () => {
    const postId = blog?._id;
    const formData = {
      title,
      body,
    };
    const notification = NotificationManager.showLoading("Editing Blog....");
    try {
      const response = await api.put(`/blog/edit/${postId}`, formData);
      if (response.data.message === "Done") {
        NotificationManager.updateLoadingToast(
          notification,
          "Blog updated!",
          1
        );
        router.push("/dashboard");
      } else {
        NotificationManager.updateLoadingToast(
          notification,
          "Error occcured! Please try agiain",
          0
        );
      }
    } catch (err) {
      console.log(err);
      NotificationManager.updateLoadingToast(
        notification,
        "Error occcured! Please check console",
        0
      );
    }
  };
  const handleDelete = async () => {
    const postId = blog?._id;
    const notification = NotificationManager.showLoading("Deleting Post");
    try {
      const response = await api.delete(`/blog/delete/${postId}`);
      if (response.data.message === "Done") {
        NotificationManager.updateLoadingToast(
          notification,
          "Blog deleted!",
          1
        );
        router.push("/dashboard");
      } else {
        NotificationManager.updateLoadingToast(
          notification,
          "Error occcured! Please try agiain",
          0
        );
      }
    } catch (err) {
      console.log(err);
      NotificationManager.updateLoadingToast(
        notification,
        "Error occcured! Please check console",
        0
      );
    }
  };

  return (
    <>
    {/* Navbar element*/}
      <nav className="  p-4 fixed  z-10 bg-gradient-to-br group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white h-25 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
        <div className="container mx-auto flex justify-between items-center ">
          <div className="text-white text-lg font-bold">MyApp</div>
          <div className="space-x-4 flex ">
            <Button onClick={handleLogout}>
              <p className="text-gray-300 hover:text-white">Logout</p>
            </Button>
          </div>
        </div>
      </nav>
      {/* Edit/delete Card component*/}
      <div className="flex justify-center items-center min-h-screen flex-col">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Edit/Delete Your Posts</CardTitle>
            <CardDescription>Transform your Blog</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Title</Label>
                  <Input
                    id="name"
                    placeholder="Name of your project"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Body</Label>
                  <Textarea
                    id="content"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your blog and remove your data from the servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={handleEdit}>Save Edit</Button>
          </CardFooter>
        </Card>
        <Link href="/dashboard" className=" cursor-pointer p-2 m-2">
          Back to Dashboard
        </Link>
      </div>
    </>
  );
}
