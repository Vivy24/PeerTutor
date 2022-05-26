import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
const Review = ({ review }) => {
  const [date, setDate] = useState("");
  useEffect(() => {
    const date = new Date(review.timestamp);
    let result = "";

    switch (date.getMonth() + 1) {
      case 1:
        result += "Jan";
        break;
      case 2:
        result += "Feb";
        break;
      case 3:
        result += "Mar";
        break;
      case 4:
        result += "Apr";
        break;
      case 5:
        result += "May";
        break;
      case 6:
        result += "Jun";
        break;
      case 7:
        result += "Jul";
        break;
      case 8:
        result += "Aug";
        break;
      case 9:
        result += "Sep";
        break;
      case 10:
        result += "Oct";
        break;
      case 11:
        result += "Nov";
        break;
      case 12:
        result += "Dec";
        break;
      default:
        break;
    }

    result += "-";
    if (date.getDate() < 10) {
      result += "0";
    }
    result += `${date.getDate()}-${date.getFullYear()} at `;
    // ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
    if (date.getHours() < 10) {
      result += "0";
    }
    result += `${date.getHours()}:`;

    if (date.getMinutes() < 10) {
      result += "0";
    }
    result += `${date.getMinutes()}:`;

    if (date.getSeconds() < 10) {
      result += "0";
    }
    result += `${date.getSeconds()}`;

    setDate(result);
  }, []);

  return (
    <div className="review">
      <div className="d-flex flex-row">
        <div className="p-2">
          <img
            src={`https://ui-avatars.com/api/?name=${review.name.replace(
              " ",
              "+"
            )}&size=64`}
          ></img>
        </div>

        <div className="pt-2">
          <h5>{review.name}</h5>
          <p>{date}</p>
        </div>
      </div>
      <div className="body ps-3">
        <p className="rating">
          Ratings: <span></span>
          <span>
            {review.rating >= 1 ? <FaStar style={{ color: "red" }} /> : ""}
          </span>
          <span>
            {review.rating >= 2 ? <FaStar style={{ color: "red" }} /> : ""}
          </span>
          <span>
            {review.rating >= 3 ? <FaStar style={{ color: "red" }} /> : ""}
          </span>
          <span>
            {review.rating >= 4 ? <FaStar style={{ color: "red" }} /> : ""}
          </span>
          <span>
            {review.rating >= 5 ? <FaStar style={{ color: "red" }} /> : ""}
          </span>
        </p>

        <p className="content">{review.content}</p>
      </div>
      <hr />
    </div>
  );
};

export default Review;
