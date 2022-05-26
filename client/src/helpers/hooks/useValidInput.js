import { useState } from "react";

export const useValidInput = (validateInput) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateInput && validateInput(enteredValue);
  const empty = enteredValue === "" && isTouched;

  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    empty,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};
