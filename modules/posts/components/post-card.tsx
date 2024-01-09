import { Avatar } from "@/components/avatar";
import BlurImage from "@/components/blur-image";
import Tooltip from "@/components/tooltip";
import { placeholderBlurhash, timeAgo } from "@/lib/utils";
import { Post, Site, SiteUser, User } from "@prisma/client";
import Link from "next/link";

export default function PostCard({
  data,
}: {
  data: Post & {
    user: User | null;
    site: (Site & { users: (SiteUser & { user: User })[] }) | null;
  };
}) {
  const url = `${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  return (
    <div className="relative rounded-lg border border-stone-200 pb-4 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        href={`/post/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="relative h-44 overflow-hidden">
          <BlurImage
            alt={data.title ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={data.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
          {!data.published && (
            <span className="absolute bottom-2 right-2 rounded-md border border-stone-200 bg-white px-3 py-0.5 text-sm font-medium text-stone-600 shadow-md">
              Draft
            </span>
          )}
        </div>
        <div className="mb-6 border-t border-stone-200 p-4 dark:border-stone-700">
          <div className="mb-1 flex max-w-fit items-center space-x-1">
            <div className="flex items-center">
              <Tooltip
                content={
                  <div className="w-full p-4">
                    <Avatar user={data?.user || {}} className="h-10 w-10" />
                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      {data?.user?.name ||
                        data?.user?.email ||
                        "Anonymous User"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Created{" "}
                      {new Date(data?.createdAt).toLocaleDateString("en-us", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                }
              >
                {/* Without the wrapping div, the Tooltip won't be triggered for some reason */}
                <div className="flex w-5">
                  <Avatar user={data?.user || {}} className="h-5 w-5" />
                </div>
              </Tooltip>
            </div>
            <p>•</p>
            <p
              className="whitespace-nowrap text-sm text-gray-500"
              suppressHydrationWarning
            >
              {timeAgo(data?.createdAt)}
            </p>
          </div>
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-stone-500 dark:text-stone-400">
            {data.description}
          </p>
        </div>
      </Link>
      {/* <div className="flex items-center space-x-3 px-4">
        <Avatar user={data?.user || {}} className="h-7 w-7" />
        <p className="text-sm font-light text-neutral-500">
          {data?.user?.name || data?.user?.email}
        </p>
      </div> */}
      <div className="absolute bottom-4 flex w-full px-4 pt-2">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.site?.subdomain}.localhost:3000/${data.slug}`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
