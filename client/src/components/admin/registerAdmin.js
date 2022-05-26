import { useValidInput } from "../../helpers/hooks/useValidInput";
import { Button, Form, Card } from "react-bootstrap";
import { Fragment, useState } from "react";
import axios from "axios";

import styles from "../../public/styles/button.module.css";
const RegisterAdmin = ({ users }) => {
  const [error, setError] = useState();
  const [result, setResult] = useState();
  const {
    value: enteredEmail,
    empty: enteredEmailEmpty,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useValidInput(() => {
    /*doing nothing on purpose*/
  });

  const submitForm = async (event) => {
    event.preventDefault();
    setResult();
    setError();
    if (enteredEmailEmpty) {
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const submitEmail = {
      email: enteredEmail,
    };
    const body = JSON.stringify(submitEmail);
    try {
      const res = await axios.post("/api/admins", body, config);
      if (res.status === 200) {
        setResult("Promoted successfully");
      }
    } catch (error) {
      setError(error.response.data.errors[0].msg);

      console.log(error);
    }

    resetEmail();
  };
  return (
    <Fragment>
      <Card className="w-75 mx-auto mt-4  pt-2" style={{ maxWidth: "600px" }}>
        {error && (
          <p className="bg-danger text-white mx-auto w-75 text-center">
            {error}
          </p>
        )}
        {result && (
          <p className="bg-success text-white mx-auto w-75 text-center">
            {result}
          </p>
        )}
        <h4
          className="mx-auto"
          style={{
            borderBottom: "3px solid red",
            width: "fit-content",
          }}
        >
          Promote to admin
        </h4>

        <Form className="w-75 mx-auto mt-3 mb-5" onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>

            <input
              style={{ width: "100%" }}
              list="sadmin"
              name="email"
              id="email"
              value={enteredEmail}
              onBlur={emailBlurHandler}
              onChange={emailChangeHandler}
              type="email"
              placeholder="Enter email"
              required
            />

            <datalist id="sadmin">
              {users.length > 0 &&
                users.map((user) => {
                  return <option value={user}></option>;
                })}
            </datalist>

            {enteredEmailEmpty && (
              <Form.Text style={{ color: "red" }}>
                Please enter an email
              </Form.Text>
            )}
          </Form.Group>

          <Button
            style={{ width: "50%" }}
            className={`${styles.leftBtn} float-end`}
            type="submit"
          >
            Promote
          </Button>
        </Form>
      </Card>
    </Fragment>
  );
};

export default RegisterAdmin;
