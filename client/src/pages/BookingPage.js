import {
  Container,
  Spinner,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaStar, FaStarHalf } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "../store/reviewAction";

// components
import DayBooking from "../components/booking/dayBooking";
import MonthBooking from "../components/booking/monthBooking";
import ReviewSection from "../components/review/reviewSection";

const BookingPage = () => {
  const [tutor, setTutor] = useState();
  const [dailyBooked, setDailyBooked] = useState(true);
  const [meetings, setPendingMeetings] = useState();
  const [average, setAverage] = useState();
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const review = useSelector((state) => state.review);

  useEffect(() => {
    if (!auth.loading) {
      setLoading(true);
    }
  }, [auth.loading]);

  useEffect(() => {
    if (loading) {
      const getTutor = async () => {
        try {
          const res = await axios.get(`/api/tutors/${params.tutorID}`);
          setTutor(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      getTutor();
    }
  }, [loading]);

  useEffect(() => {
    if (loading && tutor) {
      const getPendingMeeting = async () => {
        try {
          const meetings = await axios.get(
            `/api/meetings/pendingMeeting/${tutor.id}`
          );
          if (meetings) {
            setPendingMeetings(meetings.data);
          }
        } catch (e) {
          console.error(e);
        }
      };

      getPendingMeeting();
    }
  }, [tutor, loading]);

  useEffect(() => {
    if (loading && tutor) {
      const fetchReview = async (tutorID) => {
        await dispatch(fetchReviews(tutorID));
      };

      if (tutor) {
        fetchReview(tutor.id);
      }
    }
  }, [tutor, loading]);

  useEffect(() => {
    let numberof5Star = 0;
    let numberof4Star = 0;
    let numberof3Star = 0;
    let numberof2Star = 0;
    let numberof1Star = 0;

    if (loading) {
      review.reviews.length > 0 &&
        review.reviews.forEach((review) => {
          switch (review.rating) {
            case 5:
              numberof5Star += 1;
              break;
            case 4:
              numberof4Star += 1;
              break;
            case 3:
              numberof3Star += 1;
              break;
            case 2:
              numberof2Star += 1;
              break;
            case 1:
              numberof1Star += 1;
              break;
            default:
              break;
          }
        });

      const average =
        (5 * numberof5Star +
          4 * numberof4Star +
          3 * numberof3Star +
          2 * numberof2Star +
          1 * numberof1Star) /
        (numberof5Star +
          numberof4Star +
          numberof3Star +
          numberof2Star +
          numberof1Star);

      setAverage(average);
    }
  }, [review, loading]);

  // run when chooseMonth change to see slot time available from api

  const openDailyBooked = () => {
    setDailyBooked(true);
    setPendingMeetings([]);
  };

  const resetMeetings = () => {
    setPendingMeetings([]);
  };

  const openMonthlyBooked = () => {
    setDailyBooked(false);
    setPendingMeetings([]);
  };

  return tutor ? (
    <Container>
      <button
        className="mt-3 mb-3"
        style={{ backgroundColor: "white", border: "none" }}
        onClick={() => navigate("/")}
      >
        <FaArrowLeft style={{ color: "red", fontSize: "2rem" }} />
      </button>
      <div className="d-flex flex-row">
        <div className="p-2">
          <img
            src={`https://ui-avatars.com/api/?name=${tutor.name.replace(
              " ",
              "+"
            )}&size=128`}
          ></img>{" "}
        </div>

        <div className="p-2 w-50">
          <h3 className="text-capitalize">Name: {tutor.name}</h3>
          <p className="text-capitalize">Department: {tutor.department}</p>
          <p className="text-capitalize">Subject: {tutor.subject}</p>
          {!average.isNaN && (
            <p>
              Rating: <span> </span>
              <span>
                {average >= 1 ? (
                  <FaStar style={{ color: "red" }} />
                ) : average >= 0.5 ? (
                  <FaStarHalf style={{ color: "red" }} />
                ) : (
                  ""
                )}
              </span>
              <span>
                {average >= 2 ? (
                  <FaStar style={{ color: "red" }} />
                ) : average >= 1.5 ? (
                  <FaStarHalf style={{ color: "red" }} />
                ) : (
                  ""
                )}
              </span>
              <span>
                {average >= 3 ? (
                  <FaStar style={{ color: "red" }} />
                ) : average >= 2.5 ? (
                  <FaStarHalf style={{ color: "red" }} />
                ) : (
                  ""
                )}
              </span>
              <span>
                {average >= 4 ? (
                  <FaStar style={{ color: "red" }} />
                ) : average >= 3.5 ? (
                  <FaStarHalf style={{ color: "red" }} />
                ) : (
                  ""
                )}
              </span>
              <span>
                {average >= 5 ? (
                  <FaStar style={{ color: "red" }} />
                ) : average >= 4.5 ? (
                  <FaStarHalf style={{ color: "red" }} />
                ) : (
                  ""
                )}
              </span>
              <span> ( {parseFloat(average).toFixed(1)}/5 ) </span>
            </p>
          )}
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12 col-lg-7">
          <h3 className="text-center">Booking Calendar</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ToggleButtonGroup
              className="text-center"
              type="radio"
              name="options"
              variant="danger"
              defaultValue={1}
            >
              <ToggleButton
                id="tbg-radio-1"
                value={1}
                variant="danger"
                onClick={openDailyBooked}
              >
                Daily Booked
              </ToggleButton>
              <ToggleButton
                id="tbg-radio-2"
                value={2}
                variant="danger"
                onClick={openMonthlyBooked}
              >
                Monthly Booked
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div>
            {dailyBooked ? (
              <DayBooking
                meetings={meetings}
                loggedInUser={auth.user}
                tutor={tutor}
                reload={resetMeetings}
              />
            ) : (
              <MonthBooking
                meetings={meetings}
                loggedInUser={auth.user}
                tutor={tutor}
                reload={resetMeetings}
              />
            )}
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <ReviewSection tutor={tutor} reviewer={auth.user} />
        </div>
      </div>
    </Container>
  ) : (
    <Spinner></Spinner>
  );
};

export default BookingPage;
