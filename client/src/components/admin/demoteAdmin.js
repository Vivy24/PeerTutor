import { useValidInput } from "../../helpers/hooks/useValidInput";
import { Button, Form, Card } from "react-bootstrap";
import styles from "../../public/styles/button.module.css";
import { Fragment, useState } from "react";
import axios from "axios";

const DemoteAdmin = ({ users }) => {
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
    setError();
    setResult();
    event.preventDefault();

    if (enteredEmailEmpty) {
      return;
    }

    try {
      const res = await axios.delete("/api/admins", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: enteredEmail,
        },
      });
      if (res.status === 200) {
        setResult("Demoted successfully");
      }
    } catch (error) {
      setError(error.response.data.errors[0].msg);
    }

    resetEmail();
  };
  return (
    <Fragment>
      <Card className="w-75 mx-auto mt-4 pt-2" style={{ maxWidth: "600px" }}>
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
          className="mx-auto "
          style={{
            borderBottom: "3px solid red",
            width: "fit-content",
          }}
        >
          Demote an admin
        </h4>

        <Form className="w-75 mx-auto mt-3 mb-5" onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>

            <input
              style={{ width: "100%" }}
              list="dadmin"
              name="email"
              id="email"
              value={enteredEmail}
              onBlur={emailBlurHandler}
              onChange={emailChangeHandler}
              type="email"
              placeholder="Enter email"
              required
            />

            <datalist id="dadmin">
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

            <datalist></datalist>
          </Form.Group>

          <Button
            style={{ width: "50%" }}
            className={`${styles.leftBtn} float-end`}
            type="submit"
          >
            Demote
          </Button>
        </Form>
      </Card>
    </Fragment>
  );
};

export default DemoteAdmin;
