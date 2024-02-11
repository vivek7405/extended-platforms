import useSWR from "swr";
import { queryPipe } from "../api";
import { TopSource, TopSources } from "../types/top-sources";
import useDateFilter from "./use-date-filter";
import { getStatus } from "./use-query";

async function getTopSources(
  date_from?: string,
  date_to?: string,
  domain?: string,
): Promise<TopSources> {
  const { data: queryData } = await queryPipe<TopSource>("top_sources", {
    limit: 8,
    date_from,
    date_to,
    domain,
  });

  const data: TopSource[] = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ referrer, visits }) => ({
      referrer: referrer || "Direct",
      href: referrer ? `https://${referrer}` : undefined,
      visits,
    }));
  const refs = data.map(({ referrer }) => referrer);
  const visits = data.map(({ visits }) => visits);

  return {
    data,
    refs,
    visits,
  };
}

export default function useTopSources(domain: string) {
  const { from, to } = useDateFilter();
  // const query = useQuery([from, to, domain, "topSources"], getTopSources);
  const query = useSWR("topSources", () => getTopSources(from, to, domain));
  return {
    warning: query.error,
    status: getStatus(
      query.data,
      query.error,
      query.isValidating,
      query.isLoading,
    ),
    ...query,
  };
}
