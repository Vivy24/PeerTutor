import { addError } from "./errorActions";
import { errorActions } from "./error";

import { reviewActions } from "./review";
import axios from "axios";

export const fetchReviews = (tutorID) => {
  return async (dispatch) => {
    try {
      dispatch(errorActions.resetState());
      dispatch(reviewActions.resetReviews());
      const res = await axios.get(`/api/reviews?tutorID=${tutorID}`);
      dispatch(
        reviewActions.fetchReviews({
          reviews: res.data,
        })
      );
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "fetchReview"));
        });
      }
    }
  };
};
