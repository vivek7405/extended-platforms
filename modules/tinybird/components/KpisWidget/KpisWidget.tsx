"use client";

import Widget from "../Widget";
import KPIsTabs from "./KpisTabs";
import useKpis from "../../lib/hooks/use-kpis";
import useKpiTotals from "../../lib/hooks/use-kpi-totals";
import { AreaChart } from "@tremor/react";
import { useEffect, useMemo } from "react";
import useDomain from "../../lib/hooks/use-domain";

export default function KPIsWidget({ domain }: { domain: string }) {
  // const { domain } = useDomain();
  const { data, kpi, setKpi, kpiOption, warning, status } = useKpis(domain);
  const { data: kpiTotals, warning: warningTotals } = useKpiTotals(domain);
  const chartData = useMemo(
    () =>
      ((data as any)?.dates ?? []).map((date, index) => {
        const value = Math.max(
          Number((data as any)?.data[0][index]) || 0,
          Number((data as any)?.data[1][index]) || 0,
        );

        return {
          date: date.toUpperCase(),
          [kpiOption.label]: value,
        };
      }),
    [data, kpiOption],
  );

  return (
    <Widget>
      <Widget.Title isVisuallyHidden>KPIs</Widget.Title>
      <KPIsTabs value={kpi} onChange={setKpi} totals={kpiTotals as any} />
      <Widget.Content
        status={status}
        noData={!chartData?.length}
        warning={warning?.message}
        className="mt-4 pt-2"
      >
        <AreaChart
          data={chartData}
          index="date"
          categories={[kpiOption.label]}
          colors={["blue"]}
          valueFormatter={kpiOption.formatter}
          showLegend={false}
        />
      </Widget.Content>
    </Widget>
  );
}
