import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "../modules/auth/components/logout-button";
import { Avatar } from "./avatar";

export default async function Profile() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/settings"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        {/* <Image
          src={
            session.user.image ??
            `https://avatar.vercel.sh/${session.user.email}`
          }
          width={40}
          height={40}
          alt={session.user.name ?? "User avatar"}
          className="h-6 w-6 rounded-full"
        /> */}
        <Avatar user={session.user} className="h-7 w-7" />
        <span className="truncate text-sm font-medium">
          {session.user.name || session.user.email}
        </span>
      </Link>
      <LogoutButton />
    </div>
  );
}
