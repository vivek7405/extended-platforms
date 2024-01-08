import { getSession } from "@/lib/auth";
// import prisma from "@/prisma";

export function withUserAuth(action: (siteId: string) => any) {
  return async (siteId: string) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Unauthorized: Login required.",
      };
    }
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: session.user.id,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //   },
    // });

    return action(siteId);
  };
}
