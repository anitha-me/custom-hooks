import type { CancelTokenSource } from "axios";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

/**
 * Hook: useApiRequest
 *
 * @description Custom hook for api calls (axios is optional -> used to cancel the api request)
 *
 * @param apiRequest the api request endpoint
 * @param callOnLoad flag to call the api
 *
 * @returns data, isLoading, error, callApi - for the api endpoint
 */
export const useApiRequest = (apiRequest: any, callOnLoad = true) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource>();

  const callApi = useCallback(async (data: any = null, params: any = {}) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    setCancelTokenSource(source);

    try {
      const response = await apiRequest(data, params);

      setData(response);
      return response;
    } catch (error: any) {
      // logout

      if (!axios.isCancel(error)) {
        setError(error);
        throw error;
      }

      throw new Error(
        (error as any)?.response?.data?.message || "Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (callOnLoad) callApi();

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Request canceled");
      }
    };
  }, [callApi]);

  return { data, isLoading, error, callApi };
};
