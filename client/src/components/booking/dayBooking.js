import DayTimePicker from "@mooncake-dev/react-day-time-picker";
import { useState, Fragment } from "react";
import axios from "axios";

const DayBooking = ({ meetings, loggedInUser, tutor, reload }) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setError] = useState();

  const timeSlotValidator = (slotTime) => {
    let bookedTime = [];
    const startingTime = new Date(
      slotTime.getFullYear(),
      slotTime.getMonth(),
      slotTime.getDate(),
      6,
      0,
      0
    );

    const endTime = new Date(
      slotTime.getFullYear(),
      slotTime.getMonth(),
      slotTime.getDate(),
      20,
      0,
      0
    );
    // get the time slot already booked from the backend

    bookedTime = meetings.map((meeting) => {
      return new Date(meeting.date);
    });

    bookedTime = bookedTime.filter((date) => {
      return (
        date.getFullYear() === slotTime.getFullYear() &&
        date.getMonth() === slotTime.getMonth() &&
        date.getDate() === slotTime.getDate()
      );
    });
    bookedTime = bookedTime.map((filterDate) => {
      return filterDate.getHours();
    });

    return (
      slotTime.getTime() > startingTime.getTime() &&
      slotTime.getTime() < endTime.getTime() &&
      !bookedTime.includes(slotTime.getHours())
    );
  };

  const onConfirm = async (slotTime) => {
    if (loggedInUser.role == "Admin" || loggedInUser.role == "SAdmin") {
      setError("You are not allow to book the tutor as admin");
      return;
    }

    if (tutor.id === loggedInUser.id) {
      setError("Can not book yourself");
      return;
    }
    // set is scheduleing true, =>
    setIsScheduling(true);
    // send the date time API back to the end
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const newMeeting = {
      date: slotTime.toISOString().slice(0, 19).replace("T", " "),
      tutorID: tutor.id,
      studentID: loggedInUser.id,
      type: "Daily",
    };

    const body = JSON.stringify(newMeeting);
    try {
      await axios.post("/api/meetings", body, config);
    } catch (error) {
      setError(error.response.data.errors[0].msg);
    }

    setIsScheduled(true);
    reload();
  };

  return (
    <Fragment>
      <h3 className="text-center mt-3">Daily Book!</h3>
      <DayTimePicker
        timeSlotSizeMinutes={120}
        timeSlotValidator={timeSlotValidator}
        isLoading={isScheduling}
        isDone={isScheduled}
        onConfirm={onConfirm}
        err={scheduleErr}
      />
    </Fragment>
  );
};

export default DayBooking;
