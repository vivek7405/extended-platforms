"use client";

import Widget from "../Widget";
import useTopPages from "../../lib/hooks/use-top-pages";
import { BarList } from "@tremor/react";
import { useMemo } from "react";
import { cx, formatNumber } from "../../lib/utils";
import { TopPagesSorting } from "../../lib/types/top-pages";
import useParams from "../../lib/hooks/use-params";
import useDomain from "../../lib/hooks/use-domain";

export default function TopPagesWidget({ domain }: { domain: string }) {
  // const { domain } = useDomain();
  const { data, status, warning } = useTopPages(domain);
  const [sorting, setSorting] = useParams({
    key: "top_pages_sorting",
    values: Object.values(TopPagesSorting),
  });
  const chartData = useMemo(
    () =>
      (((data as any)?.data as any) ?? []).map((d) => ({
        name: d.pathname,
        value: d[sorting],
        href: d.href, //`https://${domain}${d.pathname}`,
      })),
    [data, domain, sorting],
  );

  return (
    <Widget>
      <Widget.Title>Top Pages</Widget.Title>
      <Widget.Content
        status={status}
        noData={!chartData?.length}
        warning={warning?.message}
      >
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-3 h-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Content
          </div>
          <div
            className={cx(
              "col-span-1 h-5 cursor-pointer text-right text-xs font-semibold uppercase tracking-widest",
              sorting === TopPagesSorting.Visitors && "text-[#0066FF]",
            )}
            onClick={() => setSorting(TopPagesSorting.Visitors)}
          >
            Visits
          </div>
          <div
            className={cx(
              "col-span-1 row-span-1 h-5 cursor-pointer text-right text-xs font-semibold uppercase tracking-widest",
              sorting === TopPagesSorting.Pageviews && "text-[#0066FF]",
            )}
            onClick={() => setSorting(TopPagesSorting.Pageviews)}
          >
            Pageviews
          </div>

          <div className="col-span-3">
            <BarList data={chartData} valueFormatter={(_) => ""} />
          </div>
          <div className="col-span-1 row-span-4 flex flex-col gap-2">
            {(((data as any)?.data as any) ?? []).map(
              ({ pathname, visits }) => (
                <div
                  key={pathname}
                  className="text-neutral-64 flex h-9 w-full items-center justify-end"
                >
                  {formatNumber(visits ?? 0)}
                </div>
              ),
            )}
          </div>
          <div className="col-span-1 row-span-4 flex flex-col gap-2">
            {(((data as any)?.data as any) ?? []).map(({ pathname, hits }) => (
              <div
                key={pathname}
                className="text-neutral-64 flex h-9 w-full items-center justify-end"
              >
                {formatNumber(hits)}
              </div>
            ))}
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
}
