"use server";

import prisma from "@/prisma";

export const removeTeammate = async (userId: string, siteId: string) => {
  if (!userId) {
    return {
      error: "Missing userId",
      status: 400,
    };
  }
  const siteUser = await prisma.siteUser.findUnique({
    where: {
      userId_siteId: {
        siteId,
        userId,
      },
    },
    select: {
      role: true,
    },
  });
  if (siteUser?.role === "owner") {
    return {
      error:
        "Cannot remove owner from site. Please transfer ownership to another user first.",
      status: 400,
    };
  }
  const response = await prisma.siteUser.delete({
    where: {
      userId_siteId: {
        siteId,
        userId,
      },
    },
  });

  return response;
};
