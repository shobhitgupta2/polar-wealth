import { useCallback, useEffect, useRef, useState } from "react";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface UseFetchOptions extends RequestInit {
  /** Skip the request entirely (useful for conditional fetching) */
  skip?: boolean;
  /** Re-fetch whenever this value changes (in addition to url changes) */
  deps?: unknown[];
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  status: FetchStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  /** Manually trigger a re-fetch */
  refetch: () => void;
  /** Abort the in-flight request */
  abort: () => void;
}

/**
 * useFetch — a general-purpose data-fetching hook.
 *
 * Features:
 * - Automatic abort on unmount / url change
 * - Idle / loading / success / error status
 * - Manual refetch support
 * - Conditional fetching via `skip`
 * - Extra dependency array for custom re-fetch triggers
 *
 * @example
 * const { data, isLoading, error, refetch } = useFetch<User[]>("/api/users");
 */
function useFetch<T = unknown>(
  url: string | null | undefined,
  options: UseFetchOptions = {},
): UseFetchResult<T> {
  const { skip = false, deps = [], ...fetchOptions } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [fetchIndex, setFetchIndex] = useState(0);

  // Keep fetchOptions stable across renders without stringifying in deps
  const fetchOptionsRef = useRef(fetchOptions);
  fetchOptionsRef.current = fetchOptions;

  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const refetch = useCallback(() => {
    setFetchIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    if (!url || skip) {
      setStatus("idle");
      return;
    }

    // Cancel any previous in-flight request
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    let cancelled = false;

    const execute = async () => {
      setStatus("loading");
      setError(null);

      try {
        const response = await fetch(url, {
          ...fetchOptionsRef.current,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type") ?? "";
        const result: T = contentType.includes("application/json")
          ? await response.json()
          : ((await response.text()) as unknown as T);

        if (!cancelled) {
          setData(result);
          setStatus("success");
        }
      } catch (err) {
        if (
          cancelled ||
          (err instanceof DOMException && err.name === "AbortError")
        ) {
          return;
        }
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setStatus("error");
        }
      }
    };

    execute();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip, fetchIndex, ...deps]);

  return {
    data,
    error,
    status,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    refetch,
    abort,
  };
}

export default useFetch;
export type { FetchStatus, UseFetchOptions, UseFetchResult };

