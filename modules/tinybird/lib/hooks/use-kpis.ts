import { usePathname, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";

import { queryPipe } from "../api";
import { KpisData, KpiType, isKpi, KPI_OPTIONS } from "../types/kpis";
import useDateFilter from "./use-date-filter";
import { getStatus } from "./use-query";
import { ChartValue } from "../types/charts";
import { getQueryFromSearchParams } from "@/lib/utils";
import useSWR from "swr";

const arrayHasCurrentDate = (dates: string[], isHourlyGranularity: boolean) => {
  const now = moment()
    .utc()
    .format(isHourlyGranularity ? "HH:00" : "MMM DD, YYYY");
  return dates[dates.length - 1] === now;
};

async function getKpis(
  kpi: KpiType,
  date_from?: string,
  date_to?: string,
  domain?: string,
) {
  const { data: queryData } = await queryPipe<KpisData>("kpis", {
    date_from,
    date_to,
    domain,
  });
  const isHourlyGranularity = !!date_from && !!date_to && date_from === date_to;
  const dates = queryData.map(({ date }) =>
    moment(date).format(isHourlyGranularity ? "HH:mm" : "MMM DD, YYYY"),
  );
  const isCurrentData = arrayHasCurrentDate(dates, isHourlyGranularity);

  const data = isCurrentData
    ? queryData.reduce(
        (acc, record, index) => {
          const value = record[kpi] ?? 0;

          const pastValue = index < queryData.length - 1 ? value : "";
          const currentValue = index > queryData.length - 3 ? value : "";

          const [pastPart, currentPart] = acc;

          return [
            [...pastPart, pastValue],
            [...currentPart, currentValue],
          ];
        },
        [[], []] as ChartValue[][],
      )
    : [queryData.map((value) => value[kpi] ?? 0), [""]];

  return {
    dates,
    data,
  };
}

export default function useKpis(domain: string) {
  const { from, to } = useDateFilter();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const kpiParam = params.get("kpi");
  const kpi = isKpi(kpiParam) ? kpiParam : "visits";
  const kpiOption = KPI_OPTIONS.find(({ value }) => value === kpi)!;
  // const query = useQuery([kpi, from, to, domain, "kpis"], getKpis);
  const query = useSWR("kpis", () => getKpis(kpi, from, to, domain));

  const setKpi = (kpi: KpiType) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set("kpi", kpi);
    router.push(`${pathname}/${getQueryFromSearchParams(searchParams)}`);
  };

  return {
    setKpi,
    kpi,
    kpiOption,
    ...{
      status: getStatus(
        query.data,
        query.error,
        query.isValidating,
        query.isLoading,
      ),
      warning: query.error,
      ...query,
    },
  };
}
