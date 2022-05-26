import ReviewForm from "./reviewForm";
import { useSelector } from "react-redux";

import Review from "./review";
import { useEffect, useState } from "react";
import Pagination from "../../helpers/UI/pagination";

const ReviewSection = ({ tutor, reviewer }) => {
  const [filterReview, setFilterReview] = useState([]);
  const state = useSelector((state) => state.review);

  useEffect(() => {
    const filterReview = state.reviews.filter((review) => {
      return review.content.length > 1;
    });
    setFilterReview(filterReview);
  }, [state.reviews]);
  return (
    <div>
      <div>
        <ReviewForm tutor={tutor} reviewer={reviewer} />
      </div>

      <div style={{ marginTop: "75px" }}>
        <hr />
        <h4>Review Comment</h4>
        {filterReview.length > 0 ? (
          <Pagination
            data={filterReview}
            RenderComponent={Review}
            pageLimit={5}
            dataLimit={2}
          />
        ) : (
          <p>This tutor does not have any commented review yet!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
