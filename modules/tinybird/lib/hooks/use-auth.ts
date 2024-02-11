import { useAnalytics } from "../../components/Provider";
import { TINYBIRD_HOST } from "../constants/host";

export default function useAuth() {
  // const router = useRouter();
  // const { token: tokenParam, host: hostParam } = router.query
  const tokenParam = process.env.NEXT_PUBLIC_TINYBIRD_DASHBOARD_TOKEN;
  const hostParam = TINYBIRD_HOST;

  const token = typeof tokenParam === "string" ? tokenParam : null;
  const host = typeof hostParam === "string" ? hostParam : null;
  const { error } = useAnalytics();
  const isTokenValid = !error || ![401, 403].includes(error.status ?? 0);
  const isAuthenticated = !!token && !!host;
  return { isAuthenticated, token, host, isTokenValid };
}
