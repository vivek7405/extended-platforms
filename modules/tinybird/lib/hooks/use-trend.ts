import moment from "moment";
import { queryPipe } from "../api";
import { Trend, TrendData } from "../types/trend";
import useDateFilter from "./use-date-filter";
import { getStatus } from "./use-query";
import useSWR from "swr";

export async function getTrend(
  date_from?: string,
  date_to?: string,
  domain?: string,
): Promise<Trend> {
  const { data } = await queryPipe<TrendData>("trend", {
    date_from,
    date_to,
    domain,
  });
  const visits = data.map(({ visits }) => visits);
  const dates = data.map(({ t }) => {
    return moment(t).format("HH:mm");
  });
  const totalVisits = visits.reduce((a, b) => a + b, 0);

  return {
    visits,
    dates,
    totalVisits,
    data,
  };
}

export default function useTrend(domain: string) {
  const { from, to } = useDateFilter();
  // const query = useQuery([from, to, domain, "trend"], getTrend);
  const query = useSWR("trend", () => getTrend(from, to, domain));
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
