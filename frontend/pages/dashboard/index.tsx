"use client";
import React, { Suspense, useCallback, useEffect } from "react";
import { Grid, GridItem } from "../../components/ui/Grid";
import Cookie from "js-cookie";
import NotificationManager from "@/lib/toastSettings";
import api from "@/lib/api";
import { useState } from "react";
import { BlogType, CreateBlogType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
 

  useEffect(() => {
    const notification = NotificationManager.showLoading("Fetching Blogs...");
    const token = Cookie.get("token");
    if (!token) {
      NotificationManager.updateLoadingToast(notification, "Not signed in!", 0);
      console.log("User not signed in");
      router.push("/login");
      return;
    }

    const userId = Cookie.get("userId");
    try {
       api.get(`/blog?authorId=${userId}`)
       .then((response)=>{
        NotificationManager.updateLoadingToast(notification, "Blogs fetched!", 1);
        const blogData = response.data.post as BlogType[];
        setBlogs(blogData);
       }).catch((err:any)=>{
        console.log(err)
          NotificationManager.updateLoadingToast(notification,"Please refresh once!",0)
       })
      
    } catch (err: any) {
      console.log(err);
      NotificationManager.updateLoadingToast(
        notification,
        `Signed out- ${err}`,
        0
      );
    }
   
  }, [router]);

  const handleCreateBlog = async () => {
    const notification = NotificationManager.showLoading("Creating Blog..");
    try {
      if (title.length < 3) {
        console.log("Validation failed: Title or body length is insufficient.");
        NotificationManager.updateLoadingToast(
          notification,
          "Validation failed!",
          0
        );
        return;
      }

      const token = Cookie.get("token");
      if (!token) {
        NotificationManager.updateLoadingToast(
          notification,
          "Token missing",
          0
        );

        router.push("/login");
        return;
      }

      const blog = { title, body };
      const response = await api.post("/blog/create", blog);
      const newBlog = response.data.post;

      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      
      NotificationManager.updateLoadingToast(notification, "Blog created!", 1);

      setTitle("");
      setBody("");
      window.location.reload()
    } catch (err) {
      console.log("Error:", err);
      NotificationManager.updateLoadingToast(
        notification,
        "Blog creation Failed!",
        0
      );
    }
  };

  const handleBlogClick = (id: string | undefined) => {
    router.push(`/blog/post/${id}`);
  };
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
      }, 1000);
    } catch (err) {
      NotificationManager.updateLoadingToast(
        notification,
        "Error logging out! Check console",
        0
      );
      console.log(err);
    }
  };
  const  sortedBlogs = [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <>
      <div className="flex flex-col ">
        <nav className="  p-4 fixed  z-10 bg-gradient-to-br group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white h-25 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">Ac</div>
            <div className="space-x-4 flex ">
              <Button onClick={handleLogout}>
                <p className="text-gray-300 hover:text-white">Logout</p>
              </Button>
            </div>
          </div>
        </nav>

        <div className="pt-20 flex justify-center items-center flex-col">
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Refresh once if your posts are not visible
          </p>
      {/* Dialog component to create new blogs */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Blog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] sm:min-h-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Blog</DialogTitle>
                <DialogDescription>
                  Create a new Blog here. Click save when you are done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div>
                  <Label htmlFor="body" className="text-right">
                    Body
                  </Label>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateBlog}>
                  <DialogClose>Save Changes</DialogClose>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        {/* Grid to Show the blogs */}
          <Grid className="max-w-4xl mx-auto mt-8 cursor-pointer">
            {sortedBlogs.map((blog, i) => (
              <GridItem
                key={i}
                title={blog?.title}
                description={blog?.body}
                header={blog?.user?.fullname}
                onClick={() => handleBlogClick(blog?._id)}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            ))}
          </Grid>
        </div>
      </div>
    </>
  );
}
