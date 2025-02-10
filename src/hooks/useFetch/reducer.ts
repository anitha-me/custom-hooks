export enum REDUCER_TYPES {
  FETCH_START = "start",
  FETCH_SUCCESS = "success",
  FETCH_ERROR = "error",
}

export type InitialStateType = {
  loading: boolean;
  data: any;
  error: boolean;
};

export type ActionType = {
  type: string;
  payload?: any;
};

export const INITIAL_STATE: InitialStateType = {
  loading: false,
  data: {},
  error: false,
};

export const fetchReducer = (
  state = INITIAL_STATE,
  action: ActionType
): InitialStateType => {
  switch (action.type) {
    case REDUCER_TYPES.FETCH_START:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case REDUCER_TYPES.FETCH_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: false,
      };
    case REDUCER_TYPES.FETCH_ERROR:
      return {
        loading: false,
        data: {},
        error: true,
      };
    default:
      return state;
  }
};
