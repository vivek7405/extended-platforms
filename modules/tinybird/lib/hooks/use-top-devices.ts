import useSWR from "swr";
import { queryPipe } from "../api";
import devices from "../constants/devices";
import { TopDevicesData, TopDevices } from "../types/top-devices";
import useDateFilter from "./use-date-filter";
import { getStatus } from "./use-query";

async function getTopDevices(
  date_from?: string,
  date_to?: string,
  domain?: string,
): Promise<TopDevices> {
  const { data: queryData } = await queryPipe<TopDevicesData>("top_devices", {
    date_from,
    date_to,
    domain,
    limit: 4,
  });
  const data = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ device, visits }) => ({
      device: devices[device] ?? device,
      visits,
    }));

  return { data };
}

export default function useTopDevices(domain: string) {
  const { from, to } = useDateFilter();
  // const query = useQuery([from, to, domain, "topDevices"], getTopDevices);
  const query = useSWR("topDevices", () => getTopDevices(from, to, domain));
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
