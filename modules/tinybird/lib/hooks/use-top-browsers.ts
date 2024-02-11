import useSWR from "swr";
import { queryPipe } from "../api";
import browsers from "../constants/browsers";
import { TopBrowsers, TopBrowsersData } from "../types/top-browsers";
import useDateFilter from "./use-date-filter";
import { getStatus } from "./use-query";

async function getTopBrowsers(
  date_from?: string,
  date_to?: string,
  domain?: string,
): Promise<TopBrowsers> {
  const { data: queryData } = await queryPipe<TopBrowsersData>("top_browsers", {
    date_from,
    date_to,
    limit: 4,
    domain,
  });
  const data = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ browser, visits }) => ({
      browser: browsers[browser] ?? browser,
      visits,
    }));

  return { data };
}

export default function useTopBrowsers(domain: string) {
  const { from, to } = useDateFilter();
  // const query = useQuery([from, to, domain, "topBrowsers"], getTopBrowsers);
  const query = useSWR("topBrowsers", () => getTopBrowsers(from, to, domain));
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
