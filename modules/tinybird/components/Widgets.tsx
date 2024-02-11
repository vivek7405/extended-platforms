"use client";

import dynamic, { LoaderComponent } from "next/dynamic";
import InView from "./InView";
import Widget from "./Widget";
import { ComponentType } from "react";

const enum WidgetHeight {
  XLarge = 588,
  Large = 472,
  Medium = 344,
  Small = 216,
}

function lazyLoadWidget(
  importPromise: () => LoaderComponent,
  loaderSize?: number,
) {
  return dynamic(importPromise, {
    loading: () => (
      <Widget>
        <Widget.Content status="loading" loaderSize={loaderSize} />
      </Widget>
    ),
    ssr: false,
  });
}

const KPIsWidget = lazyLoadWidget(
  () => import("./KpisWidget"),
  80,
) as ComponentType<{ domain: string }>;
const TopBrowsersWidget = lazyLoadWidget(
  () => import("./TopBrowsersWidget"),
) as ComponentType<{ domain: string }>;
const TopPagesWidget = lazyLoadWidget(
  () => import("./TopPagesWidget"),
) as ComponentType<{ domain: string }>;
const TrendWidget = lazyLoadWidget(
  () => import("./TrendWidget"),
  40,
) as ComponentType<{ domain: string }>;
const TopDevicesWidget = lazyLoadWidget(
  () => import("./TopDevicesWidget"),
) as ComponentType<{ domain: string }>;
const TopSourcesWidget = lazyLoadWidget(
  () => import("./TopSourcesWidget"),
) as ComponentType<{ domain: string }>;
const TopLocationsWidget = lazyLoadWidget(
  () => import("./TopLocationsWidget"),
) as ComponentType<{ domain: string }>;

export default function Widgets({ domain }: { domain: string }) {
  return (
    <div className="grid-rows-3-auto grid grid-cols-2 gap-5 sm:gap-10">
      <div className="col-span-2" style={{ height: WidgetHeight.XLarge }}>
        <KPIsWidget domain={domain} />
      </div>
      <div className="grid-rows-3-auto col-span-2 col-start-1 grid grid-cols-1 gap-5 sm:gap-10 lg:col-span-1">
        <InView height={WidgetHeight.Small}>
          <TrendWidget domain={domain} />
        </InView>
        <InView height={WidgetHeight.Large}>
          <TopPagesWidget domain={domain} />
        </InView>
        <InView height={WidgetHeight.Large}>
          <TopLocationsWidget domain={domain} />
        </InView>
      </div>
      <div className="grid-rows-2-auto lg:grid-rows-3-auto col-span-2 col-start-1 grid grid-cols-1 gap-5 sm:gap-10 md:grid-cols-2 lg:col-span-1 lg:col-start-2 lg:grid-cols-1">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <InView height={WidgetHeight.Large}>
            <TopSourcesWidget domain={domain} />
          </InView>
        </div>
        <InView height={WidgetHeight.Medium}>
          <TopDevicesWidget domain={domain} />
        </InView>
        <InView height={WidgetHeight.Medium}>
          <TopBrowsersWidget domain={domain} />
        </InView>
      </div>
    </div>
  );
}
