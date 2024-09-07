import { getSession } from "@/lib/auth";
import People from "@/modules/people/components/people";
import { notFound, redirect } from "next/navigation";
import prisma from "@/prisma";

export default async function PeoplePage({ params }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
    include: {
      users: {
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });

  const siteUser = data.users.find((u) => u.userId === session.user.id);

  if (!data || !siteUser || siteUser.role !== "owner") {
    notFound();
  }

  return <People />;
}
