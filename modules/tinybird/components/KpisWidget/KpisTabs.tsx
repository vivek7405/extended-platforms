import { KpiTotals, KpiType, KPI_OPTIONS } from "../../lib/types/kpis";

type KpisTabsProps = {
  value: KpiType;
  onChange: (kpi: KpiType) => void;
  totals?: KpiTotals;
};

export default function KpisTabs({
  onChange,
  value: selectedKpi,
  totals,
}: KpisTabsProps) {
  return (
    <div
      role="tablist"
      className="-mx-6 -mt-6 grid grid-cols-2 overflow-hidden rounded-t-xl sm:grid-cols-4 lg:flex lg:flex-wrap"
    >
      {KPI_OPTIONS.map(({ label, value, formatter }) => (
        <button
          key={value}
          role="tab"
          aria-selected={selectedKpi === value}
          data-state={value === selectedKpi ? "active" : undefined}
          className="relative cursor-pointer p-6 text-left text-[#25283D] transition-colors hover:bg-[#e5f0ff] state-active:text-[#0066FF] sm:mb-2 sm:state-active:border-b-4 sm:state-active:border-[#0066FF] md:p-9 md:text-center"
          onClick={() => onChange(value)}
        >
          <div className="flex w-fit flex-col gap-2 md:mx-auto">
            <span className="text-md truncate font-medium capitalize lg:text-lg lg:leading-6">
              {label}
            </span>
            <span
              className="text-neutral-64 text-left font-normal"
              aria-hidden={true}
            >
              {totals ? formatter(totals[value]) : "-"}
            </span>
          </div>
          <div className="arrow absolute -bottom-5 hidden h-3 w-3 bg-[#0066FF] sm:block" />
        </button>
      ))}
    </div>
  );
}
