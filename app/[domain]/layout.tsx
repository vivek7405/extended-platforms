import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import prisma from "@/prisma";
import CTA from "@/modules/sites/components/cta";
import ReportAbuse from "@/modules/sites/components/report-abuse";
import { notFound, redirect } from "next/navigation";
import { fontMapper } from "@/lib/styles/fonts";
import { Metadata } from "next";
import { getSiteData } from "@/modules/sites/fetchers";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const decodedDomain = decodeURIComponent(params.domain);
  const data = await getSiteData(decodedDomain);
  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vercel",
    },
    icons: [logo],
    metadataBase: new URL(`https://${decodedDomain}`),
  };
}

export async function generateStaticParams() {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      where: {
        NOT: {
          customDomain: null,
        },
      },
      select: {
        customDomain: true,
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return allPaths.map((domain) => ({
    params: {
      domain,
    },
  }));
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const { domain } = params;
  const decodedDomain = decodeURIComponent(domain);
  const data = await getSiteData(decodedDomain);

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    decodedDomain.endsWith(`.${process.env.NEXT_PUBLIC_DYNAMIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <div className={fontMapper[data.font]}>
      <div className="ease left-0 right-0 top-0 z-30 flex h-16 bg-white transition-all duration-150 dark:bg-black dark:text-white">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 px-10 sm:px-20">
          <Link href="/" className="flex items-center justify-center">
            <div className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
              <Image
                alt={data.name || ""}
                height={40}
                src={data.logo || ""}
                width={40}
              />
            </div>
            <span className="ml-3 inline-block truncate font-title font-medium">
              {data.name}
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-20">{children}</div>

      {decodedDomain ==
      `demo.${process.env.NEXT_PUBLIC_DYNAMIC_ROOT_DOMAIN}` ? (
        <CTA />
      ) : (
        <ReportAbuse />
      )}
    </div>
  );
}
