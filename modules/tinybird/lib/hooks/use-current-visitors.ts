import useSWR from "swr";
import { querySQL } from "../api";
import useDomain from "./use-domain";

async function getCurrentVisitors([domain]): Promise<number> {
  const { data } = await querySQL<{ visits: number }>(
    `SELECT uniq(session_id) AS visits FROM analytics_hits
      WHERE timestamp >= (now() - interval 5 minute) FORMAT JSON and href like concat('%',{{${domain}}},'%')`,
  );
  const [{ visits }] = data;
  return visits;
}

export default function useCurrentVisitors() {
  const { domain } = useDomain();
  const { data } = useSWR([domain], getCurrentVisitors);
  return data ?? 0;
}
