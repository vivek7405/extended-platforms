// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV === "development") global.prisma = prisma;

// export default prisma;

import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const ProxyPrisma = new Proxy(PrismaClient, {
  construct(target, args) {
    if (typeof window !== "undefined") return {};
    globalThis["db"] = globalThis["db"] || new target(...args);
    return globalThis["db"];
  },
});

const prisma = new ProxyPrisma();

export default prisma;
