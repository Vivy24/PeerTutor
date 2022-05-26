import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  fetchTutorMeeting,
  fetchStudentMeeting,
} from "../../store/meetingActions";
const MeetingDetail = ({
  date,
  name,
  email,
  subject,
  department,
  id,
  tutor,
  status,
}) => {
  const [dateString, setDateString] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const fisishedDate = new Date(date);

    let dateString = "";
    dateString += `${fisishedDate.getFullYear()}-`;

    if (fisishedDate.getMonth() + 1 < 10) {
      dateString += "0";
    }
    dateString += fisishedDate.getMonth() + 1;
    dateString += "-";
    if (fisishedDate.getDate < 10) {
      dateString += "0";
    }

    dateString += fisishedDate.getDate();
    dateString += `\n at ${fisishedDate.getHours()}:00`;

    setDateString(dateString);
  }, []);
  const finishMeeting = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const meetingID = {
      meetingID: id,
    };
    const body = JSON.stringify(meetingID);

    try {
      await axios.put("/api/meetings/approve", body, config);
    } catch (e) {
      console.log(e);
    }
    dispatch(fetchTutorMeeting());
  };

  const deleteMeeting = async () => {
    // chanbge status of meeting from booked to deleted !
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const meetingID = {
      meetingID: id,
    };
    const body = JSON.stringify(meetingID);

    try {
      await axios.put("/api/meetings/delete", body, config);
    } catch (e) {
      console.log(e);
    }
    if (tutor) {
      dispatch(fetchTutorMeeting());
    } else {
      dispatch(fetchStudentMeeting());
    }
  };

  return (
    <tr>
      <th scope="row">{dateString}</th>
      <td style={{ wordBreak: "break-word" }}>
        {name} - {email}
      </td>
      <td>
        {tutor ? (
          status === "Booked" ? (
            <button
              style={{
                backgroundColor: "green",
                border: "1px solid green",
                color: "white",
              }}
              value={id}
              onClick={finishMeeting}
            >
              Finish
            </button>
          ) : (
            status == "Finished" && <FaCheck style={{ color: "green" }} />
          )
        ) : (
          `${subject} (${department})`
        )}
      </td>

      <td>
        {tutor && status === "Deleted" && <FaTimes style={{ color: "red" }} />}
        {status == "Booked" && (
          <button
            style={{
              backgroundColor: "red",
              border: "1px solid red",
              color: "white",
            }}
            value={id}
            onClick={deleteMeeting}
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};

export default MeetingDetail;
