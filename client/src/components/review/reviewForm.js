import axios from "axios";
import { useDispatch } from "react-redux";
import { Rating } from "react-simple-star-rating";
import { useState, Fragment } from "react";
import { Button, Form } from "react-bootstrap";
import button from "../../public/styles/button.module.css";
import { useValidInput } from "../../helpers/hooks/useValidInput";
import { fetchReviews } from "../../store/reviewAction";

import styles from "../../public/styles/reviewForm.module.css";
const ReviewForm = ({ tutor, reviewer }) => {
  const [rating, setRating] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const dispatch = useDispatch();

  const {
    value: enteredContent,
    valueChangeHandler: ContentChangeHandler,
    inputBlurHandler: ContentBlurHandler,
    reset: resetContent,
  } = useValidInput((value) => {
    // doing nothing on purpose
  });
  const handleRating = (rate) => {
    switch (rate) {
      case 20:
        setRating(1);
        break;
      case 40:
        setRating(2);
        break;
      case 60:
        setRating(3);
        break;
      case 80:
        setRating(4);
        break;
      case 100:
        setRating(5);
        break;
      default:
        setRating(0);
    }
  };

  const sendAReview = async (event) => {
    event.preventDefault();

    if (rating == 0) {
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const review = {
      tutorID: tutor.id,
      reviewerID: reviewer.id,
      content: enteredContent,
      rating: rating,
    };

    const body = JSON.stringify(review);
    try {
      await axios.post("/api/reviews", body, config).then(async (res) => {
        if (res.status === 200) {
          await dispatch(fetchReviews(tutor.id));
          setSuccess("Your review has been recorded");
          setError("");
        }
      });
    } catch (error) {
      setSuccess("");
      setError(error.response.data.errors[0].msg);
    }

    resetContent();
  };

  return (
    <Fragment>
      <h4 className={styles.reviewHeader}>Write A Review</h4>
      <Rating
        onClick={handleRating}
        ratingValue={rating}
        size={30}
        label
        transition
        fillColor="red"
        emptyColor="gray"
      />
      <form onSubmit={sendAReview}>
        <div className="form-group">
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={enteredContent}
            onChange={ContentChangeHandler}
            onBlur={ContentBlurHandler}
            placeholder="Leave your review here..."
          ></textarea>
        </div>
        {success && <Form.Text style={{ color: "green" }}>{success}</Form.Text>}
        {error && <Form.Text>{error}</Form.Text>}
        <Button
          style={{ width: "30%" }}
          className={`${button.leftBtn} mt-2 float-end`}
          type="submit"
        >
          Leave A Review
        </Button>
      </form>
    </Fragment>
  );
};

export default ReviewForm;
