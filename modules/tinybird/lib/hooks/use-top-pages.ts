import useSWR from "swr";
import { queryPipe } from "../api";
import { TopPagesData, TopPagesSorting } from "../types/top-pages";
import useDateFilter from "./use-date-filter";
import useParams from "./use-params";
import { getStatus } from "./use-query";

async function getTopPages(
  sorting: TopPagesSorting,
  date_from?: string,
  date_to?: string,
  domain?: string,
) {
  const { data: queryData, meta } = await queryPipe<TopPagesData>(
    "top_pages_dup",
    {
      limit: 8,
      date_from,
      date_to,
      domain,
    },
  );
  const data = [...queryData].sort((a, b) => b[sorting] - a[sorting]);

  const columnLabels = {
    pathname: "content",
    visits: "visitors",
    hits: "pageviews",
  };
  const columns = meta.map(({ name }) => ({
    label: columnLabels[name],
    value: name,
  }));
  const pages = data.map(({ pathname }) => pathname);
  const labels = data.map((record) => record[sorting]);

  return {
    data,
    columns,
    pages,
    labels,
  };
}

export default function useTopPages(domain: string) {
  const { from, to } = useDateFilter();
  const [sorting] = useParams({
    key: "top_pages_sorting",
    defaultValue: TopPagesSorting.Visitors,
    values: Object.values(TopPagesSorting),
  });
  // const query = useQuery(
  //   [sorting, from, to, domain, "topPages"],
  //   getTopPages,
  // );
  const query = useSWR("topPages", () =>
    getTopPages(sorting, from, to, domain),
  );
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
