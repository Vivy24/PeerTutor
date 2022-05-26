import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

import { fetchTutorMeeting } from "../store/meetingActions";

import { FaArrowLeft } from "react-icons/fa";

import MeetingDetail from "../components/meeting/meetingDetail";

const TutorMeetingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meeting = useSelector((state) => state.meeting);
  const errors = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(fetchTutorMeeting());
  }, []);
  return (
    <Container>
      <button
        className="mt-3"
        style={{ backgroundColor: "white", border: "none" }}
        onClick={() => navigate("/")}
      >
        <FaArrowLeft style={{ color: "red", fontSize: "2rem" }} />
      </button>

      <h3
        className="text-center mb-3 "
        style={{ textDecoration: "underline 3px solid red" }}
      >
        Tutor Upcoming Meetings
      </h3>
      {errors.errors.length > 0 ? (
        <p className="text-center">
          Something went wrong! Please contact admin
        </p>
      ) : meeting && meeting.tutorMeeting && meeting.tutorMeeting.length > 0 ? (
        <table className="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Student Name</th>
              <th scope="col">Done</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>

          <tbody>
            {meeting.tutorMeeting.map((meeting) => {
              return (
                <MeetingDetail
                  key={meeting.id}
                  date={meeting.date}
                  email={meeting.email}
                  name={meeting.name}
                  id={meeting.id}
                  status={meeting.status}
                  tutor={true}
                />
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No upcoming meeting </p>
      )}
    </Container>
  );
};

export default TutorMeetingPage;
