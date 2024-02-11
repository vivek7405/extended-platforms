"use client";

import { useState } from "react";
import useSWR, { Key, Fetcher } from "swr";
import { QueryError, QueryResponse, QueryStatus } from "../types/api";

// export default function useQuery<T, K extends Key>(
//   key: K,
//   fetcher: Fetcher<T, K>,
//   config?: {
//     onSuccess?: (data: T) => void;
//     onError?: (error: QueryError) => void;
//   },
// ): QueryResponse<T> {
//   const [warning, setWarning] = useState<QueryError | null>(null);

//   const handleError = (error: QueryError) => {
//     config?.onError?.(error);
//     if (error.status !== 404 && error.status !== 400) return;
//     setWarning(error);
//   };

//   const handleSuccess = (data: T) => {
//     config?.onSuccess?.(data);
//     setWarning(null);
//   };

//   const query = useSWR(key, fetcher, {
//     onError: handleError,
//     onSuccess: handleSuccess,
//   });

//   const { data, error, isValidating } = query;

//   return { ...query, warning, status: getStatus(data, error, isValidating) };
// }

export const getStatus = (data, error, isValidating, isLoading) => {
  let status = "idle";
  if (isLoading) status = "loading";
  if (isValidating) status = "updating";
  if (error) status = "error";
  if (!!data) status = "success";

  return status as QueryStatus;
};
