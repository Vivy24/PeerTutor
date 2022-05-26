import { Container, Card, Form, Button } from "react-bootstrap";
import { useValidInput } from "../helpers/hooks/useValidInput";
import styles from "../public/styles/button.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addError } from "../store/errorActions";
import { errorActions } from "../store/error";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RequestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.error);

  const [success, setSuccess] = useState(false);
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
    dispatch(errorActions.resetState());
    if (enteredDepartmentEmpty || enteredSubjectEmpty) {
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const tutorRequest = {
      subject: enteredSubject,
      department: enteredDepartment,
    };

    const body = JSON.stringify(tutorRequest);

    try {
      await axios.post("/api/requests", body, config);
      setSuccess(true);
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "request"));
        });
      }
    }

    // submit the form;

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

      <h2
        className="mx-auto mt-5"
        style={{
          borderBottom: "3px solid red",
          width: "fit-content",
        }}
      >
        Request to be a tutor
      </h2>
      <Card className="w-75 mx-auto mt-4" style={{ maxWidth: "600px" }}>
        {error &&
          error.errors.map((error) => {
            return (
              <Form.Text
                className="ms-3 mt-1"
                key={error.id}
                style={{ color: "red" }}
              >
                {error.msg}
              </Form.Text>
            );
          })}

        {success && error.errors.length === 0 && (
          <Form.Text className="ms-3 mt-1" style={{ color: "blue" }}>
            Successfully Requested
          </Form.Text>
        )}
        <Form className="w-75 mx-auto my-5" onSubmit={submitForm}>
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
            Request to be a tutor
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default RequestForm;
