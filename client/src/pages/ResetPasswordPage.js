import { Form, Container, Card, Button } from "react-bootstrap";
import { useValidInput } from "../helpers/hooks/useValidInput";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

import styles from "../public/styles/button.module.css";
const ResetPasswordPage = () => {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const params = useParams();

  const {
    value: enteredPassword,
    empty: enteredPasswordEmpty,
    hasError: PasswordHasError,
    valueChangeHandler: PasswordChangeHandler,
    inputBlurHandler: PasswordBlurHandler,
    reset: resetPassword,
  } = useValidInput((value) => {
    return /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(
      value
    );
  });

  const {
    value: enteredCPassword,
    empty: enteredCPasswordEmpty,
    hasError: cPasswordHasError,
    valueChangeHandler: cPasswordChangeHandler,
    inputBlurHandler: cPasswordBlurHandler,
    reset: resetcPassword,
  } = useValidInput((value) => {
    return value === enteredPassword;
  });

  const submitForm = async (event) => {
    event.preventDefault();

    const id = params.id;
    const token = params.token;

    if (
      enteredPasswordEmpty ||
      PasswordHasError ||
      enteredCPasswordEmpty ||
      cPasswordHasError
    ) {
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const resetPassword = {
      userId: id,
      token,
      password: enteredCPassword,
    };
    const body = JSON.stringify(resetPassword);
    try {
      const res = await axios.post("/api/forgetpassword/reset", body, config);
      console.log(res);
      if (res.status === 200) {
        setResult("Reset Password Successfully!");
        setError("");
      }
    } catch (error) {
      setError(error.response.data.errors[0].msg);
      setResult("");
    }

    resetPassword();
    resetcPassword();
  };

  return (
    <Container>
      <h2
        className="mx-auto mt-5"
        style={{
          borderBottom: "3px solid red",
          width: "fit-content",
        }}
      >
        Reset Password
      </h2>

      {result ? (
        <Form.Text className="ms-3 mt-1" style={{ color: "green" }}>
          {result}
        </Form.Text>
      ) : (
        <Form.Text className="ms-3 mt-1" style={{ color: "red" }}>
          {error}
        </Form.Text>
      )}
      <Card className="w-75 mx-auto mt-4" style={{ maxWidth: "600px" }}>
        <Form className="w-75 mx-auto mt-3 mb-5" onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              value={enteredPassword}
              onBlur={PasswordBlurHandler}
              onChange={PasswordChangeHandler}
              type="password"
              placeholder="Enter your password"
            />
            {enteredPasswordEmpty || PasswordHasError ? (
              <Form.Text style={{ color: "red" }}>
                Please enter a valid password
              </Form.Text>
            ) : (
              <Form.Text className="text-muted">
                Your password must includes one uppercase character, one
                lowercase character, one number and one symbol.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCPassword">
            <Form.Label>Confirm Your New Password</Form.Label>
            <Form.Control
              value={enteredCPassword}
              onBlur={cPasswordBlurHandler}
              onChange={cPasswordChangeHandler}
              type="password"
              placeholder="Reenter your password"
            />
            {cPasswordHasError || enteredCPasswordEmpty ? (
              <Form.Text style={{ color: "red" }}>
                Password and confirm password should be matched.
              </Form.Text>
            ) : (
              <Form.Text className="text-muted">
                Confirm your password.
              </Form.Text>
            )}
          </Form.Group>
          <Button
            style={{ width: "50%" }}
            className={`${styles.leftBtn} float-end`}
            type="submit"
          >
            Reset Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;
