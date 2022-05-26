import { Fragment } from "react";
const HourDay = ({
  isHidden,
  notAvailableHours,
  weekday,
  recordTimeWeekDay,
}) => {
  return (
    notAvailableHours && (
      <Fragment>
        <select
          className="form-select-sm"
          hidden={isHidden}
          style={{
            maxWidth: "10rem",
          }}
          id="mHour"
          class="form-control"
          onChange={recordTimeWeekDay}
        >
          <option selected disabled>
            Place your hour...
          </option>
          {!notAvailableHours.includes("8") && (
            <option value={`${weekday}/8`}>8:00</option>
          )}
          {!notAvailableHours.includes("10") && (
            <option value={`${weekday}/10`}>10:00</option>
          )}
          {!notAvailableHours.includes("12") && (
            <option value={`${weekday}/12`}>12:00</option>
          )}
          {!notAvailableHours.includes("14") && (
            <option value={`${weekday}/14`}>14:00</option>
          )}
          {!notAvailableHours.includes("16") && (
            <option value={`${weekday}/16`}>16:00</option>
          )}
          {!notAvailableHours.includes("18") && (
            <option value={`${weekday}/18`}>18:00</option>
          )}
          {!notAvailableHours.includes("20") && (
            <option value={`${weekday}/20`}>20:00</option>
          )}
        </select>
      </Fragment>
    )
  );
};

export default HourDay;
