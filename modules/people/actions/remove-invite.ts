"use server";

import prisma from "@/prisma";

export const removeInvite = async (email: string, siteId: string) => {
  if (!email) {
    return {
      error: "Missing email",
      status: 400,
    };
  }

  const siteInvite = await prisma.siteInvite.findUnique({
    where: {
      email_siteId: {
        email,
        siteId,
      },
    },
    select: {
      email: true,
    },
  });

  if (!siteInvite?.email) {
    return {
      error:
        "Didn't find an invite with that email. Please refresh the page and try again.",
      status: 400,
    };
  }

  const response = await prisma.siteInvite.delete({
    where: {
      email_siteId: {
        email,
        siteId,
      },
    },
  });

  return response;
};
