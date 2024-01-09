"use server";

import { getSession } from "@/lib/auth";
import { sendEmail } from "@/modules/emails/actions/send-email";
import SiteInvite from "@/modules/emails/templates/site-invite";
import prisma from "@/prisma";
import { createHash, randomBytes } from "crypto";

const hashToken = (token: string) => {
  return createHash("sha256")
    .update(`${token}${process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
};

export const sendInvite = async (email: string, siteId: string) => {
  //   const { email } = req.body;
  const session = await getSession();

  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    return {
      error: "Site not found.",
    };
  }

  const alreadyInTeam = await prisma.siteUser.findFirst({
    where: {
      siteId: site.id,
      user: {
        email,
      },
    },
  });
  if (alreadyInTeam) {
    return {
      status: 400,
      error: "User already exists in this site.",
    };
    // return res.status(400).end("User already exists in this site.");
  }

  // if (site.plan === "free") {
  //   const users = await prisma.siteUser.count({
  //     where: {
  //       siteId: site.id,
  //     },
  //   });
  //   const invites = await prisma.siteInvite.count({
  //     where: {
  //       siteId: site.id,
  //     },
  //   });
  //   if (users + invites >= 3) {
  //     return {
  //       status: 400,
  //       error: "You've reached the maximum number of users for the free plan.",
  //     };
  //     //   return res
  //     //     .status(400)
  //     //     .end("You've reached the maximum number of users for the free plan.");
  //   }
  // }

  // same method of generating a token as next-auth
  const token = randomBytes(32).toString("hex");
  const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14;
  const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);

  // create a site invite record and a verification request token that lasts for a week
  // here we use a try catch to account for the case where the user has already been invited
  // for which `prisma.siteInvite.create()` will throw a unique constraint error
  try {
    await prisma.siteInvite.create({
      data: {
        email,
        expires,
        siteId: site.id,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashToken(token),
        expires,
      },
    });

    const params = new URLSearchParams({
      callbackUrl: `${process.env.NEXTAUTH_URL}/site/${site.id}`,
      email,
      token,
    });

    const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

    sendEmail({
      subject: "You've been invited to join a site on Platforms",
      email,
      react: SiteInvite({
        email,
        url,
        siteName: site.name || "",
        siteUser: session?.user?.name || "",
        siteUserEmail: session?.user?.email || "",
      }),
    });

    // return res.status(200).json({ message: "Invite sent" });
    return {
      status: 200,
      message: "Invite sent",
    };
  } catch (error) {
    return {
      status: 400,
      error: "User already invited.",
    };
    // return res.status(400).end("User already invited.");
  }
};
