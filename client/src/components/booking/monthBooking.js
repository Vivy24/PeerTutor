import { useEffect, useState, Fragment } from "react"
import { Button } from "react-bootstrap"
import HourDay from "./monthlyBooking.js/hourday"

import styles from "./monthBook.module.css"
import button from "../../public/styles/button.module.css"

import axiosConfig from "../../axiosconfig"
const MonthBooking = ({ meetings, loggedInUser, tutor, reload }) => {
  const [choosenMonth, setChosenMonth] = useState()
  const [choosenHour, setChosenHour] = useState([])
  const [chosenWeekDay, setChosenWeekDay] = useState([])

  const [availableMonth, setAvailableMonth] = useState([])
  const [thisyear, setThisYear] = useState()
  const [nextyear, setNextYear] = useState()
  const [pendingDateHour, setPendingDateHour] = useState([])
  const [weekday] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ])

  const [bookingError, setBookingError] = useState()
  const [success, setSuccess] = useState()

  useEffect(() => {
    // set available month
    const next6Month = []
    const today = new Date(Date.now())
    const currentMonth = today.getMonth() + 1
    for (let i = 1; i < 7; i++) {
      next6Month.push(currentMonth + i)
    }
    setThisYear(today.getFullYear())
    setNextYear(today.getFullYear() + 1)
    setAvailableMonth(next6Month)

    // reset the form
  }, [])

  useEffect(() => {
    let bookedTime
    let month, year
    let bookedDayHour
    if (choosenMonth && choosenMonth.length > 0 && meetings) {
      month = choosenMonth.split(" ")[0]
      year = choosenMonth.split(" ")[1]
      bookedTime = meetings.map((meeting) => {
        return new Date(meeting.date)
      })

      bookedTime = bookedTime.filter(
        (date) => date.getMonth() + 1 == month && date.getFullYear() == year
      )
      if (bookedTime.length > 0) {
        bookedDayHour = bookedTime.map((date) => {
          return `${date.getDay()}/${date.getHours()}`
        })

        setPendingDateHour(bookedDayHour)
      }
    }
  }, [choosenMonth])

  const chooseMonth = (event) => {
    setChosenMonth(event.target.value)
  }

  const chooseWeekDayEvent = (event) => {
    if (event.target.checked) {
      setChosenWeekDay((prevChosenWeekday) => {
        return [...prevChosenWeekday, event.target.value]
      })
    } else {
      setChosenWeekDay((prevChosenWeekday) => {
        return prevChosenWeekday.filter((choosenWeekday) => {
          return choosenWeekday != event.target.value
        })
      })
    }
  }

  const getWeekdayInAMonth = (year, month, weekday, hour) => {
    const allDateInAMonth = []

    const date = new Date(year, month - 1, 1, hour)
    date.setDate(date.getDate() + ((7 + weekday - date.getDay()) % 7))
    let copyDate = new Date(date.valueOf())
    allDateInAMonth.push(copyDate)

    for (let i = 0; i < 4; i++) {
      date.setDate(date.getDate() + 7)

      if (date.getMonth() == month - 1) {
        let copyDate = new Date(date.valueOf())
        allDateInAMonth.push(copyDate)
      }
    }

    return allDateInAMonth
  }

  const bookMonthly = async (event) => {
    event.preventDefault()

    if (!choosenMonth || choosenHour.length === 0) {
      setBookingError("Please choose at least one month and date to book")
      return
    }
    const month = parseInt(choosenMonth.split(" ")[0])
    const year = parseInt(choosenMonth.split(" ")[1])

    const bookedHour = choosenHour.filter((weekHour) => {
      return chosenWeekDay.includes(weekHour.day)
    })

    await bookedHour.forEach(async (bookedHour) => {
      const allWeekdayInAMonth = getWeekdayInAMonth(
        year,
        month,
        bookedHour.day,
        bookedHour.hour
      )

      const formattedWeekDay = allWeekdayInAMonth.map((date) =>
        date.toISOString().slice(0, 19).replace("T", " ")
      )

      if (loggedInUser.role == "Admin" || loggedInUser.role == "SAdmin") {
        setBookingError("You are not allow to book the tutor as admin")
        return
      }

      if (tutor.id === loggedInUser.id) {
        setBookingError("Can not book yourself")
        return
      }

      // send the date time API back to the end
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const newMonthlyMeetings = {
        date: formattedWeekDay,
        tutorID: tutor.id,
        studentID: loggedInUser.id,
        type: "Monthly",
      }

      const body = JSON.stringify(newMonthlyMeetings)
      try {
        await axiosConfig.post("/api/meetings", body, config).then((res) => {
          setBookingError([])
          setSuccess(res.data)
        })
      } catch (error) {
        setSuccess([])
        setBookingError(error.response.data.errors[0].msg)
      }
    })

    setChosenWeekDay([])
    event.target.reset()

    reload()
  }

  const recordTimeWeekDay = (event) => {
    const [weekday, hour] = event.target.value.split("/")
    const bookedHour = {
      day: weekday,
      hour: hour,
    }

    setChosenHour((prevChosenHour) => {
      let updatedChosenHour
      if (
        prevChosenHour.some((choosenHour) => choosenHour.day == bookedHour.day)
      ) {
        updatedChosenHour = prevChosenHour.map((choosenHour) => {
          if (choosenHour.day == bookedHour.day) {
            return bookedHour
          } else {
            return choosenHour
          }
        })
      } else {
        updatedChosenHour = [...prevChosenHour, bookedHour]
      }

      return updatedChosenHour
    })
  }
  return (
    <Fragment>
      <h3 className="text-center mt-3">Monthly Book!</h3>

      <form
        onSubmit={bookMonthly}
        className={styles.bookingForm}
      >
        {success && (
          <div class="bg-success text-white text-center w-50 mx-auto rounded">
            {success}
          </div>
        )}
        {bookingError && (
          <div class="bg-danger text-white text-center w-70 mx-auto rounded">
            {bookingError}
          </div>
        )}
        <p>Pick a month to book</p>
        <label for="monthlyBook">Monthly Book</label>
        <select
          onChange={chooseMonth}
          id="monthlyBook"
          class="form-control"
        >
          <option
            selected
            disabled
          >
            Choose Monthly...
          </option>
          {availableMonth.map((month) => {
            let displayMonth = month
            let displayOption = ""
            let year
            if (month > 12) {
              displayMonth = month - 12
            }

            switch (displayMonth) {
              case 1:
                displayOption += "January"
                break
              case 2:
                displayOption += "February"
                break
              case 3:
                displayOption += "March"
                break
              case 4:
                displayOption += "April"
                break
              case 5:
                displayOption += "May"
                break
              case 6:
                displayOption += "June"
                break
              case 7:
                displayOption += "July"
                break
              case 8:
                displayOption += "August"
                break
              case 9:
                displayOption += "September"
                break
              case 10:
                displayOption += "October"
                break
              case 11:
                displayOption += "November"
                break
              case 12:
                displayOption += "December"
                break
              default:
                break
            }

            if (month > 12) {
              displayOption += ` ${nextyear}`
              year = nextyear
            } else {
              displayOption += ` ${thisyear}`
              year = thisyear
            }

            return <option value={`${month} ${year}`}>{displayOption}</option>
          })}
        </select>
        {choosenMonth && (
          <Fragment>
            <p>Pick a day in a week you want to have meeting in each week</p>

            <div class="container">
              {weekday.map((day, index) => {
                return (
                  <div class="row align-items-center mb-2">
                    <div class="col-5">
                      <input
                        class="form-check-input me-1"
                        type="checkbox"
                        value={index + 1}
                        id={index + 1}
                        onChange={chooseWeekDayEvent}
                      />
                      <label
                        class="form-check-label"
                        for="defaultCheck1"
                      >
                        {day}
                      </label>
                    </div>
                    <div class="col">
                      <HourDay
                        weekday={index + 1}
                        isHidden={!chosenWeekDay.includes("" + (index + 1))}
                        notAvailableHours={pendingDateHour
                          .filter((date) => {
                            return date.includes(`${index + 1}/`)
                          })
                          .map((date) => {
                            return date.split("/")[1]
                          })}
                        recordTimeWeekDay={recordTimeWeekDay}
                      />
                    </div>
                  </div>
                )
              })}

              <div class="row align-items-center mb-2">
                <div class="col-5">
                  <input
                    class="form-check-input me-1"
                    type="checkbox"
                    value={0}
                    id={0}
                    onChange={chooseWeekDayEvent}
                  />
                  <label
                    class="form-select-label "
                    for="defaultCheck1"
                  >
                    Sunday
                  </label>
                </div>
                <div class="col-7">
                  <HourDay
                    isHidden={!chosenWeekDay.includes("0")}
                    notAvailableHours={pendingDateHour
                      .filter((date) => {
                        return date.includes("0/")
                      })
                      .filter((date) => {
                        return date.split("/")[1]
                      })}
                    monthYear={choosenMonth}
                    recordTimeWeekDay={recordTimeWeekDay}
                  />
                </div>
              </div>
            </div>

            <Button
              style={{ width: "30%" }}
              className={`${button.leftBtn} float-end mt-3`}
              type="submit"
            >
              Book
            </Button>
          </Fragment>
        )}
      </form>
    </Fragment>
  )
}

export default MonthBooking
