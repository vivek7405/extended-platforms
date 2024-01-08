"use server";

import prisma from "@/prisma";

export const setRole = async (userId: string, siteId: string, role: string) => {
  if (!userId || !role) {
    return {
      error: "Missing userId or role",
      status: 400,
    };
  }

  const response = await prisma.siteUsers.update({
    where: {
      userId_siteId: {
        siteId,
        userId,
      },
    },
    data: {
      role,
    },
  });

  return response;
};
