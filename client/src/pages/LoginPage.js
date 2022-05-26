import { Container, Form, Button, Card } from "react-bootstrap";
import styles from "../public/styles/button.module.css";
import { useValidInput } from "../helpers/hooks/useValidInput";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../store/authActions";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const errors = useSelector((state) => state.error);

  const {
    value: enteredEmail,
    empty: enteredEmailEmpty,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useValidInput(() => {
    /*doing nothing on purpose*/
  });

  const {
    value: enteredPassword,
    empty: enteredPasswordEmpty,
    valueChangeHandler: PasswordChangeHandler,
    inputBlurHandler: PasswordBlurHandler,
    reset: resetPassword,
  } = useValidInput(() => {
    /*doing nothing on purpose*/
  });

  const submitForm = async (event) => {
    event.preventDefault();

    if (enteredEmailEmpty || enteredPasswordEmpty) {
      return;
    }

    // submit the form;
    await dispatch(logIn(enteredEmail, enteredPassword));

    resetEmail();
    resetPassword();
  };

  const loggedToGuestAccount = async () => {
    await dispatch(logIn("guest12@gmail.com", "Guest123."));
  };

  if (auth.isAuthenticated) {
    navigate("/tutors");
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
        Log In
      </h2>
      <Card className="w-75 mx-auto mt-4" style={{ maxWidth: "600px" }}>
        {errors &&
          errors.errors.filter((error) => {
            return error.type == "auth";
          }).length > 0 &&
          errors.errors
            .filter((error) => {
              return error.type === "auth";
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

        <Form className="w-75 mx-auto my-5" onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              value={enteredEmail}
              onBlur={emailBlurHandler}
              onChange={emailChangeHandler}
              type="email"
              placeholder="Enter email"
            />
            {enteredEmailEmpty && (
              <Form.Text style={{ color: "red" }}>
                Please enter an email
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
            {enteredPasswordEmpty && (
              <Form.Text style={{ color: "red" }}>
                Please enter a password
              </Form.Text>
            )}
          </Form.Group>

          <Button
            style={{ width: "50%" }}
            className={`${styles.leftBtn} float-end`}
            type="submit"
          >
            Log In
          </Button>
        </Form>
      </Card>

      <p className="text-center mt-3">
        Guest Login ?
        <button
          style={{
            backgroundColor: "white",
            color: "red",
            border: "none",
            textDecoration: "underline",
          }}
          onClick={loggedToGuestAccount}
        >
          Click here to login
        </button>
      </p>

      <p className="text-center mt-3">
        Forget Password ?
        <Link style={{ color: "red" }} to="/forgetpassword">
          {" "}
          Click here to reset
        </Link>
      </p>
    </Container>
  );
};

export default LoginPage;
