import { useReducer } from "react";
import { fetchReducer, INITIAL_STATE, REDUCER_TYPES } from "./reducer";

interface FetchType {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object;
}

/**
 * Hook: useFetch
 * @description This hook is to handle data, loading and error state for a fetch api call.
 *
 * @returns request function call which accepts url, body and fetch method
 * @returns cancel function to cancel the api request
 * @returns loading state of the api call
 * @returns response data from the api
 * @returns error, if any that occured during the api request.
 */
const useFetch = () => {
  const [apiCall, dispatch] = useReducer(fetchReducer, INITIAL_STATE);
  const controller = new AbortController();
  const signal = controller.signal;

  const request = async ({ url, body, method = "GET" }: FetchType) => {
    try {
      dispatch({ type: REDUCER_TYPES.FETCH_START });

      const requestHeader = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal,
      };
      const response = await fetch(url, requestHeader);
      const responseJSON = await response.json();

      if (response.ok) {
        dispatch({
          type: REDUCER_TYPES.FETCH_SUCCESS,
          payload: { responseJSON, responseCode: response.status },
        });
        return { ...responseJSON, responseCode: response.status };
      } else {
        const error = responseJSON?.detail?.[0] ||
          responseJSON?.detail || { msg: responseJSON?.message };
        throw Error(JSON.stringify(error));
      }
    } catch (err: any) {
      const error = err as Error;

      dispatch({
        type: REDUCER_TYPES.FETCH_ERROR,
        payload: { error, message: JSON.parse(error.message) },
      });
    }
  };

  const cancel = () => {
    controller.abort();
  };

  return {
    request,
    cancel,
    loading: apiCall.loading,
    response: apiCall.data,
    error: apiCall.error,
  };
};

export default useFetch;
