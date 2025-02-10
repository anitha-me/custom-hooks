import { useReducer } from "react";

interface StateProps {
  error?: {} | null;
  isLoading: boolean;
  data: any;
}

interface ActionProps {
  type: string;
  payload?: {} | null;
}

/*
 * action types
 */
const FETCH_START = "fetch/start";
const FETCH_COMPLETE = "fetch/complete";
const ERROR = "fetch/error";

const initialState = {
  error: null,
  isLoading: false,
  data: null,
};

const reducer = (state: StateProps, action: ActionProps) => {
  switch (action.type) {
    case FETCH_START:
      return {
        ...initialState,
        isLoading: true,
      };
    case FETCH_COMPLETE:
      return {
        ...initialState,
        data: action.payload,
      };
    case ERROR:
      return {
        ...initialState,
        error: action.payload,
      };
    default:
      return state;
  }
};

const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Hook: useFetch
 * @description This hook is to handle data, loading and error state for a fetch api call.
 *
 * @returns state from the api
 * @returns call function which accepts url and api options
 * @returns cancel function to cancel the api request state of the api call
 */
const useFetch = (url: string, options: RequestInit = defaultOptions) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const abortController = new AbortController();

  function call(body: any) {
    dispatch({ type: FETCH_START });

    return fetch(url, {
      ...defaultOptions,
      ...options,
      body: JSON.stringify(body),
      signal: abortController.signal,
    })
      .then(async (response) => {
        const jsonResponse = await response.json();

        if (response.ok) {
          dispatch({ type: FETCH_COMPLETE, payload: jsonResponse.response });
        } else {
          dispatch({ type: ERROR, payload: jsonResponse.response });
        }

        return response;
      })
      .catch((error) => {
        dispatch({ type: ERROR, payload: error });

        return error;
      });
  }

  function cancel() {
    abortController.abort();
  }

  return { state, call, cancel };
};

export default useFetch;
