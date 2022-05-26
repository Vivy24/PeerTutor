import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { fetchStudentMeeting } from "../store/meetingActions";
import { useDispatch, useSelector } from "react-redux";
import MeetingDetail from "../components/meeting/meetingDetail";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentMeetingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meeting = useSelector((state) => state.meeting);
  const errors = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(fetchStudentMeeting());
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
        Student Incoming Meetings
      </h3>
      {errors.errors.length > 0 ? (
        <p className="text-center">
          Something went wrong! Please contact admin
        </p>
      ) : meeting &&
        meeting.bookedMeeting &&
        meeting.bookedMeeting.length > 0 ? (
        <table className="table" style={{ maxWidth: "1000px", margin: "auto" }}>
          <thead class="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Tutor Name</th>
              <th scope="col">Subject-Department</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>

          <tbody>
            {meeting.bookedMeeting.map((meeting) => {
              return (
                <MeetingDetail
                  key={meeting.id}
                  date={meeting.date}
                  department={meeting.department}
                  email={meeting.email}
                  name={meeting.name}
                  subject={meeting.subject}
                  id={meeting.id}
                  tutor={false}
                  status={meeting.status}
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

export default StudentMeetingPage;
