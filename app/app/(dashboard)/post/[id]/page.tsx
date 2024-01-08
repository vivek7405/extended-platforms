import { getSession } from "@/lib/auth";
import Editor from "@/modules/posts/components/editor";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // const data = await unstable_cache(
  //   async () => {
  //     const post = await prisma.post.findUnique({
  //       where: {
  //         id: decodeURIComponent(params.id),
  //       },
  //       include: {
  //         updatedByUser: true,
  //         user: true,
  //         site: {
  //           select: {
  //             subdomain: true,
  //           },
  //         },
  //       },
  //     });
  //     return post;
  //   },
  //   [`post-${decodeURIComponent(params.id)}`],
  //   {
  //     revalidate: 900, // 15 minutes
  //     tags: [`post-${decodeURIComponent(params.id)}`],
  //   },
  // )();
  const data = await prisma.post.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      updatedByUser: true,
      user: true,
      site: {
        include: {
          users: { include: { user: true } },
        },
        // select: {
        //   subdomain: true,
        // },
      },
    },
  });
  if (
    !data ||
    !data?.site?.users
      ?.map((siteUser) => siteUser?.user.id)
      ?.includes(session.user.id)
  ) {
    notFound();
  }

  return <Editor post={data} />;
}
