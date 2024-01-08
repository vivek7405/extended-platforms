"use server";

import { getSession } from "@/lib/auth";
import { withUserAuth } from "@/modules/users/auth";
import prisma from "@/prisma";

export const acceptInvite = withUserAuth(async (siteId: string) => {
  if (!siteId || typeof siteId !== "string") {
    return {
      status: 400,
      error: "Missing or misconfigured site id",
    };
  }

  const session = await getSession();

  const invite = await prisma.siteInvite.findFirst({
    where: {
      email: session?.user?.email,
      site: {
        id: siteId,
      },
    },
    select: {
      expires: true,
      siteId: true,
    },
  });
  if (!invite) {
    return {
      status: 404,
      error: "Invalid invitation",
    };
  } else if (invite.expires < new Date()) {
    return {
      status: 410,
      error: "Invalid invitation",
    };
  } else {
    const response = await Promise.all([
      prisma.siteUsers.create({
        data: {
          userId: session?.user?.id || "",
          role: "member",
          siteId: invite.siteId,
        },
      }),
      prisma.siteInvite.delete({
        where: {
          email_siteId: {
            email: session?.user?.email || "",
            siteId: invite.siteId,
          },
        },
      }),
    ]);
    return response;
  }
});
