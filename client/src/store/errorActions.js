import { errorActions } from "./error";
import { v4 as uuid } from "uuid";

export const addError = (msg, type) => {
  return (dispatch) => {
    const id = uuid();
    const error = {
      id,
      msg,
      type,
    };

    dispatch(
      errorActions.setError({
        error: error,
      })
    );
  };
};
