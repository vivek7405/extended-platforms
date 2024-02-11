"use client";

import { Fragment } from "react";
import { DonutChart } from "@tremor/react";
import Widget from "../Widget";
import useTopDevices from "../../lib/hooks/use-top-devices";
import { formatNumber } from "../../lib/utils";
import { tremorPieChartColors } from "../../lib/styles/theme/tremor-colors";
import useDomain from "../../lib/hooks/use-domain";

export default function TopDevicesWidget({ domain }: { domain: string }) {
  // const { domain } = useDomain();
  const { data, warning, status } = useTopDevices(domain);

  return (
    <Widget>
      <Widget.Title>Top Devices</Widget.Title>
      <Widget.Content
        status={status}
        noData={!((data as any)?.data as any)?.length}
        warning={warning?.message}
      >
        <div className="grid h-full w-full grid-cols-2">
          <DonutChart
            data={((data as any)?.data as any) ?? []}
            category="visits"
            index="device"
            colors={tremorPieChartColors.map(([color]) => color)}
            showLabel={false}
            valueFormatter={formatNumber}
          />
          <div className="justify-self-end">
            <div className="grid grid-cols-2 gap-4 gap-y-1">
              <div className="truncate text-center text-xs font-medium uppercase tracking-widest">
                Device
              </div>
              <div className="truncate text-right text-xs font-medium uppercase tracking-widest">
                Visitors
              </div>
              {(((data as any)?.data as any) ?? []).map(
                ({ device, visits }, index) => (
                  <Fragment key={device}>
                    <div className="text-neutral-64 z-10 flex h-9 items-center gap-2 rounded-md px-4 py-2 text-sm leading-5">
                      <div
                        className="h-4 min-w-[1rem]"
                        style={{
                          backgroundColor: tremorPieChartColors[index][1],
                        }}
                      />
                      <span>{device}</span>
                    </div>
                    <div className="text-neutral-64 flex h-9 items-center justify-end">
                      {formatNumber(visits)}
                    </div>
                  </Fragment>
                ),
              )}
            </div>
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
}
