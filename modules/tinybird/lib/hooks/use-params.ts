import { getQueryFromSearchParams } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useParams<T extends string>({
  key,
  defaultValue,
  values,
}: {
  key: string;
  defaultValue?: T;
  values: T[];
}): [T, (param: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const param = params.get(key) as T;
  const value =
    typeof param === "string" && values.includes(param)
      ? param
      : defaultValue ?? values[0];

  const setParam = (param: T) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set(key, param);
    router.push(`${pathname}${getQueryFromSearchParams(searchParams)}`);
    // router.push(
    //   {
    //     query: searchParams.toString(),
    //   },
    //   undefined,
    //   { scroll: false },
    // );
  };

  return [value, setParam];
}
