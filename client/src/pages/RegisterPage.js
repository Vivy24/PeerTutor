import { Container, Form, Button, Card } from "react-bootstrap";
import styles from "../public/styles/button.module.css";
import { useValidInput } from "../helpers/hooks/useValidInput";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../store/authActions";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const errors = useSelector((state) => state.error);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    value: enteredUsername,
    empty: enteredUserEmpty,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsername,
  } = useValidInput((value) => {
    return value.length > 4;
  });

  const {
    value: enteredEmail,
    empty: enteredEmailEmpty,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useValidInput((value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  });

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

    if (
      enteredUserEmpty ||
      usernameHasError ||
      enteredEmailEmpty ||
      emailHasError ||
      enteredPasswordEmpty ||
      PasswordHasError ||
      enteredCPasswordEmpty ||
      cPasswordHasError
    ) {
      return;
    }

    await dispatch(register(enteredUsername, enteredEmail, enteredPassword));

    resetUsername();
    resetEmail();
    resetPassword();
    resetcPassword();
  };

  if (auth.isAuthenticated && !auth.isLoading) {
    navigate("/");
  }

  return (
    <Container>
      <h2
        className="mx-auto mt-5"
        style={{
          borderBottom: "3px solid red",
          width: "fit-content",
        }}
      >
        Register User
      </h2>
      <Card className="w-75 mx-auto mt-4" style={{ maxWidth: "600px" }}>
        {errors &&
          errors.errors.filter((error) => {
            return error.type == "register";
          }).length > 0 &&
          errors.errors
            .filter((error) => {
              return error.type === "register";
            })
            .map((error) => {
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

        <Form className="w-75 mx-auto mt-3 mb-5" onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              value={enteredEmail}
              onBlur={emailBlurHandler}
              onChange={emailChangeHandler}
              type="email"
              placeholder="Enter email"
            />
            {emailHasError || enteredEmailEmpty ? (
              <Form.Text style={{ color: "red" }}>
                Please enter a valid email
              </Form.Text>
            ) : (
              <Form.Text className="text-muted">
                Use this email to sign in.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Display name</Form.Label>
            <Form.Control
              value={enteredUsername}
              onBlur={usernameBlurHandler}
              onChange={usernameChangeHandler}
              type="text"
              placeholder="Enter display name"
            />
            {enteredUserEmpty || usernameHasError ? (
              <Form.Text style={{ color: "red" }}>
                Please enter a valid display name
              </Form.Text>
            ) : (
              <Form.Text className="text-muted">
                Your username must be 4 or over 4 characters length. People will
                see this name.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
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
            <Form.Label>Confirm Your Password</Form.Label>
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
            Register
          </Button>
        </Form>
      </Card>

      <p className="text-center mt-2">
        Already have an account?{" "}
        <a style={{ color: "red" }} href="login">
          Login Here
        </a>
      </p>
    </Container>
  );
};

export default RegisterPage;
