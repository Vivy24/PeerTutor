import { useSelector, useDispatch } from "react-redux";
import { Container, Button, Form } from "react-bootstrap";
import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useValidInput } from "../helpers/hooks/useValidInput";
import { fetchTutorMeeting } from "../store/meetingActions";

import styles from "../public/styles/button.module.css";
import axios from "axios";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth).user;
  const navigate = useNavigate();
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const meeting = useSelector((state) => state.meeting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!(meeting && meeting.tutorMeeting && meeting.tutorMeeting.length > 0)) {
      dispatch(fetchTutorMeeting());
    }
  }, []);

  const {
    value: enteredDepartment,
    empty: enteredDepartmentEmpty,
    valueChangeHandler: DepartmentChangeHandler,
    inputBlurHandler: DepartmentBlurHandler,
    reset: resetDepartment,
  } = useValidInput(() => {
    /*doing nothing on purpose*/
  });

  const {
    value: enteredSubject,
    empty: enteredSubjectEmpty,
    valueChangeHandler: SubjectChangeHandler,
    inputBlurHandler: SubjectBlurHandler,
    reset: resetSubject,
  } = useValidInput(() => {
    /*doing nothing on purpose*/
  });

  const submitForm = async (event) => {
    event.preventDefault();

    if (meeting && meeting.tutorMeeting && meeting.tutorMeeting.length > 0) {
      setError(
        "Please finish or delete all your upcoming meeting before changing subject and department"
      );

      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const createNewRequest = {
      department: enteredDepartment,
      subject: enteredSubject,
    };
    const body = JSON.stringify(createNewRequest);
    try {
      const res = await axios.post("/api/tutors/edit", body, config);
      if (res.status === 200) {
        setResult(
          "You have been set to student until an admin approve your new department and subject"
        );
      }
    } catch (error) {
      setError(error.response.data.errors[0].msg);
    }

    resetDepartment();
    resetSubject();
  };

  return (
    <Container>
      <button
        className="mt-3"
        style={{ backgroundColor: "white", border: "none" }}
        onClick={() => navigate("/")}
      >
        <FaArrowLeft style={{ color: "red", fontSize: "2rem" }} />
      </button>

      <h3>Your profile</h3>
      <div className="d-flex flex-row">
        <div className="p-2">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name.replace(
              " ",
              "+"
            )}&size=128`}
            alt="avatar"
          ></img>
        </div>

        <div className="p-2">
          <h2 className="text-capitalize">Name: {user.name}</h2>

          {user.role == "Tutor" && (
            <Fragment>
              <p className="text-capitalize">Department: {user.department}</p>
              <p className="text-capitalize">Subject: {user.subject}</p>
            </Fragment>
          )}
        </div>
      </div>

      {user.role == "Tutor" && (
        <Fragment>
          <h3 className="text-center mt-3">
            Change your subject and department
          </h3>
          {result && <p>{result}</p>}
          {error && <p>{error}</p>}

          <Form className="w-75 mx-auto" onSubmit={submitForm}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Department</Form.Label>
              <Form.Control
                value={enteredDepartment}
                onBlur={DepartmentBlurHandler}
                onChange={DepartmentChangeHandler}
                type="text"
                placeholder="Enter your department"
              />
              {enteredDepartmentEmpty && (
                <Form.Text style={{ color: "red" }}>
                  Please enter a department
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                value={enteredSubject}
                onBlur={SubjectBlurHandler}
                onChange={SubjectChangeHandler}
                type="text"
                placeholder="Enter your subject"
              />
              {enteredSubjectEmpty && (
                <Form.Text style={{ color: "red" }}>
                  Please enter a subject
                </Form.Text>
              )}
            </Form.Group>

            <Button
              style={{ width: "50%" }}
              className={`${styles.leftBtn} float-end`}
              type="submit"
            >
              Change Department And Subject
            </Button>
          </Form>
        </Fragment>
      )}
    </Container>
  );
};

export default ProfilePage;
