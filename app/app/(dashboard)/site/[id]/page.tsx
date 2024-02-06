import { getSession } from "@/lib/auth";
import { AcceptInviteModal } from "@/modules/people/components/accept-invite-modal";
import CreatePostButton from "@/modules/posts/components/create-post-button";
import Posts from "@/modules/posts/components/posts";
import prisma from "@/prisma";
import { notFound, redirect } from "next/navigation";

export default async function SitePosts({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // const data = await unstable_cache(
  //   async () => {
  //     return await prisma.site.findUnique({
  //       where: {
  //         id: params.id,
  //       },
  //       include: {
  //         users: {
  //           select: {
  //             userId: true,
  //           },
  //         },
  //       },
  //     });
  //   },
  //   [`site-${params.id}`],
  //   {
  //     revalidate: 900, // 15 minutes
  //     tags: [`site-${params.id}`],
  //   },
  // )();

  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      users: {
        select: {
          userId: true,
        },
      },
    },
  });

  // check if the user has any pending invite for this site
  const pendingInvite = await prisma.siteInvite.findUnique({
    where: {
      email_siteId: {
        email: session.user.email,
        siteId: params.id,
      },
    },
    include: {
      site: {
        select: {
          name: true,
        },
      },
    },
  });

  if (
    !pendingInvite &&
    (!data || !data.users.map((d) => d.userId).includes(session.user.id))
  ) {
    notFound();
  }

  const url = `${data?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      {pendingInvite ? (
        <AcceptInviteModal invite={pendingInvite} />
      ) : data ? (
        <>
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
              <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
                All Posts for {data.name}
              </h1>
              <a
                href={
                  process.env.NEXT_PUBLIC_VERCEL_ENV
                    ? `https://${url}`
                    : `http://${data.subdomain}.localhost:3000`
                }
                target="_blank"
                rel="noreferrer"
                className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
              >
                {url} ↗
              </a>
            </div>
            <CreatePostButton />
          </div>
          <Posts siteId={params.id} />
        </>
      ) : (
        notFound()
      )}
    </>
  );
}
