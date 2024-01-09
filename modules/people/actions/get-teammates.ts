"use server";

import prisma from "@/prisma";

export const getTeammates = async (siteId: string) => {
  const users = await prisma.siteUser.findMany({
    where: {
      siteId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      role: true,
      createdAt: true,
    },
  });

  return users.map((u) => ({
    ...u.user,
    role: u.role,
    createdAt: u.createdAt,
  }));
};
