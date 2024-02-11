"use client";

import Widget from "../Widget";
import useTopLocations from "../../lib/hooks/use-top-locations";
import { BarList } from "@tremor/react";
import { useMemo } from "react";
import useParams from "../../lib/hooks/use-params";
import { TopLocationsSorting } from "../../lib/types/top-locations";
import { cx } from "../../lib/utils";
import useDomain from "../../lib/hooks/use-domain";

export default function TopLocationsWidget({ domain }: { domain: string }) {
  // const { domain } = useDomain();
  const { data, status, warning } = useTopLocations(domain);
  const [sorting, setSorting] = useParams({
    key: "top_locations_sorting",
    values: Object.values(TopLocationsSorting),
  });
  const chartData = useMemo(
    () =>
      (((data as any)?.data as any) ?? []).map((d) => ({
        name: d.location,
        value: d[sorting],
      })),
    [data, sorting],
  );

  return (
    <Widget>
      <Widget.Title>Top Locations</Widget.Title>
      <Widget.Content
        status={status}
        noData={!((data as any)?.data as any)?.length}
        warning={warning?.message}
      >
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-3 h-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Country
          </div>
          <div
            className={cx(
              "col-span-1 h-5 cursor-pointer text-right text-xs font-semibold uppercase tracking-widest",
              sorting === TopLocationsSorting.Visitors && "text-[#0066FF]",
            )}
            onClick={() => setSorting(TopLocationsSorting.Visitors)}
          >
            Visits
          </div>
          <div
            className={cx(
              "col-span-1 h-5 cursor-pointer text-right text-xs font-semibold uppercase tracking-widest",
              sorting === TopLocationsSorting.Pageviews && "text-[#0066FF]",
            )}
            onClick={() => setSorting(TopLocationsSorting.Pageviews)}
          >
            Pageviews
          </div>

          <div className="col-span-3">
            <BarList data={chartData} valueFormatter={(_) => ""} />
          </div>
          <div className="col-span-1 row-span-4 flex flex-col gap-2">
            {(((data as any)?.data as any) ?? []).map(
              ({ location, visits }) => (
                <div
                  key={location}
                  className="text-neutral-64 flex h-9 w-full items-center justify-end"
                >
                  {visits}
                </div>
              ),
            )}
          </div>
          <div className="col-span-1 row-span-4 flex flex-col gap-2">
            {(((data as any)?.data as any) ?? []).map(({ location, hits }) => (
              <div
                key={location}
                className="text-neutral-64 flex h-9 w-full items-center justify-end"
              >
                {hits}
              </div>
            ))}
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
}
