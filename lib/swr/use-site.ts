"use client";

import useSWR from "swr";
// import { SiteProps } from "#/lib/types";
import { fetcher } from "@/lib/utils";
import { Site } from "@prisma/client";
import { useParams } from "next/navigation";

export default function useSite() {
  const { slug } = useParams() as {
    slug: string;
  };

  const { data: site, error } = useSWR<Site>(
    slug && `/api/sites/${slug}`,
    fetcher,
    {
      dedupingInterval: 30000,
    },
  );

  // const exceededUsage = useMemo(() => {
  //   if (site) {
  //     return site.usage > site.usageLimit;
  //   }
  // }, [site]);

  return {
    ...site,
    // exceededUsage,
    error,
    // loading: !router.isReady || (slug && !site && !error),
    loading: slug && !site && !error,
  };
}
