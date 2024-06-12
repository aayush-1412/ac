// "use client";
// import { Grid, GridItem } from "@/components/ui/Grid";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Suspense, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { BlogType } from "@/lib/types";
// import NotificationManager from "@/lib/toastSettings";
// import api from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// export default function Home() {
//   const [blogs, setBlogs] = useState<BlogType[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const notification = NotificationManager.showLoading(
//       "Fetching all blogs..."
//     );
//     try {
//       api
//         .get(`/blog/all`)
//         .then((res) => {
//           const blogData = res.data.posts as BlogType[];
//           if (blogData.length === 0) {
//             return;
//           }
//           NotificationManager.updateLoadingToast(
//             notification,
//             "All Blogs Fetched",
//             1
//           );
//           setBlogs(res.data.posts);
         
//         })
//         .catch((err) => {
//           console.log(err);
//           NotificationManager.updateLoadingToast(
//             notification,
//             "Error fetching blogs",
//             0
//           );
//         });
//     } catch (err) {
//       console.log(err);
//       NotificationManager.updateLoadingToast(
//         notification,
//         "Error fetching blogs see console for more",
//         0
//       );
//     }
//   }, [router]);
//   const  sortedBlogs = [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

//   return (
//     <>
//       <div className="flex  flex-col ">
//       <nav className="  p-4  fixed  z-10 bg-gradient-to-br group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white h-25 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
//           <div className="container mx-auto flex justify-between items-center">
//             <div className="text-white text-lg font-bold">Ac</div>
//             <div className="space-x-4 flex ">
//               <Link href="/login" >
//                 <p className="text-gray-300 hover:text-white">Login</p>
//               </Link>
//               <Link href="/register" >
//                 <p className="text-gray-300 hover:text-white">Register</p>
//               </Link>
//             </div>
//           </div>
//         </nav>

//         <Grid className="max-w-4xl mx-auto mt-24">
//           <Suspense fallback={<Skeleton className="h-[200px] rounded-xl w-[250px]" />}>
//             {sortedBlogs.map((blog, i) => (
//               <GridItem
//                 key={i}
//                 title={blog?.title}
//                 description={blog?.body}
//                 header={blog?.user?.fullname}
//                 className={i === 3 || i === 6 ? "md:col-span-2" : ""}
//               />
//             ))}
//           </Suspense>
//         </Grid>
//       </div>
//     </>
//   );
// }

import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import Link from "next/link";
import { BlogType } from "@/lib/types";
import api from "@/lib/api";
import NotificationManager from "@/lib/toastSettings";
import { GetServerSideProps } from "next";

interface HomeProps {
  blogs: BlogType[];
}

export default function Home({ blogs }: HomeProps) {
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <div className="flex  flex-col ">
        <nav className="p-4 fixed z-10 bg-gradient-to-br group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white h-25 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">Ac</div>
            <div className="space-x-4 flex">
              <Link href="/login">
                <p className="text-gray-300 hover:text-white">Login</p>
              </Link>
              <Link href="/register">
                <p className="text-gray-300 hover:text-white">Register</p>
              </Link>
            </div>
          </div>
        </nav>

        <Grid className="max-w-4xl mx-auto mt-24">
          <Suspense fallback={<Skeleton className="h-[200px] rounded-xl w-[250px]" />}>
            {sortedBlogs.map((blog, i) => (
              <GridItem
                key={i}
                title={blog?.title}
                description={blog?.body}
                header={blog?.user?.fullname}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            ))}
          </Suspense>
        </Grid>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await api.get(`/blog/all`);
    const blogData = res.data.posts as BlogType[];

    return {
      props: {
        blogs: blogData.length > 0 ? blogData : [],
      },
    };
  } catch (err) {
    console.error(err);
    NotificationManager.showLoading("Error fetching blogs");

    return {
      props: {
        blogs: [],
      },
    };
  }
};
