import { Container, Card, Form, Button } from "react-bootstrap"
import { useValidInput } from "../helpers/hooks/useValidInput"
import { useState } from "react"

import styles from "../public/styles/button.module.css"
import axiosConfig from "../axiosconfig"

const ForgetPassword = () => {
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const {
    value: enteredEmail,
    empty: enteredEmailEmpty,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useValidInput(() => {
    /*doing nothing on purpose*/
  })

  const resetPassword = async (event) => {
    event.preventDefault()
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const submitEmail = {
      email: enteredEmail,
    }
    const body = JSON.stringify(submitEmail)
    try {
      const res = await axiosConfig.post("/api/forgetpassword", body, config)
      console.log(res)
      if (res.status === 200) {
        setResult("Reset Email Sent Successfully!")
        setError("")
      }
    } catch (error) {
      setError(error.response.data.errors[0].msg)
      setResult("")
    }

    resetEmail()
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
        Forget Password
      </h2>
      <Card
        className="w-75 mx-auto mt-4"
        style={{ maxWidth: "600px" }}
      >
        {result ? (
          <Form.Text
            className="ms-3 mt-1"
            style={{ color: "green" }}
          >
            {result}
          </Form.Text>
        ) : (
          <Form.Text
            className="ms-3 mt-1"
            style={{ color: "red" }}
          >
            {error}
          </Form.Text>
        )}

        <Form
          className="w-75 mx-auto my-5"
          onSubmit={resetPassword}
        >
          <Form.Group
            className="mb-3"
            controlId="formBasicEmail"
          >
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

          <Button
            style={{ width: "50%" }}
            className={`${styles.leftBtn} float-end`}
            type="submit"
          >
            Reset
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default ForgetPassword
