import { Container, Button } from "react-bootstrap"
import Tutor from "../components/tutor/Tutor"
import button from "../public/styles/button.module.css"
import { useEffect, useState, Fragment } from "react"
import { fetchTutor } from "../store/tutorActions"
import { useDispatch, useSelector } from "react-redux"
import { tutorActions } from "../store/tutor"
import axiosConfig from "../axiosconfig"

const TutorPage = () => {
  const dispatch = useDispatch()
  const tutors = useSelector((state) => state.tutor)
  const errors = useSelector((state) => state.error)

  const [departments, setDepartments] = useState([])
  const [subjects, setSubject] = useState([])

  const [searchingError, setSearchingError] = useState()

  useEffect(() => {
    dispatch(fetchTutor())
  }, [])

  useEffect(() => {
    const departmentArray = []
    const subjectArray = []
    tutors.tutors.forEach((tutor) => {
      if (!departmentArray.includes(tutor.department) && tutor.department) {
        departmentArray.push(tutor.department)
      }

      if (!subjectArray.includes(tutor.subject) && tutor.subject) {
        subjectArray.push(tutor.subject)
      }
    })

    setDepartments(departmentArray)

    setSubject(subjectArray)
  }, [tutors])

  const searching = async (event) => {
    event.preventDefault()

    const department = event.target.department.value
    const subject = event.target.subject.value

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const searchForm = {
        department,
        subject,
      }

      const body = JSON.stringify(searchForm)

      await axiosConfig.post("/api/tutors/search", body, config).then((res) => {
        dispatch(
          tutorActions.fetchAllTutor({
            tutors: res.data,
          })
        )
      })
    } catch (error) {
      setSearchingError(error.response.data.errors[0].msg)
    }
  }

  return (
    <Container>
      <form
        onSubmit={searching}
        className="mt-4"
      >
        <div>
          <label
            className="ms-3 me-2"
            style={{ width: "85px" }}
            for="department"
          >
            Department:
          </label>

          <input
            list="departments"
            name="department"
            id="department"
            required
          />

          <datalist id="departments">
            {departments.length > 0 &&
              departments.map((department) => {
                return <option value={department}></option>
              })}
          </datalist>
        </div>
        <div className="mt-1">
          <label
            className="ms-3 me-2"
            for="subject"
            style={{ width: "85px" }}
          >
            Subject:
          </label>
          <input
            list="subjects"
            name="subject"
            id="subject"
            required
          />
          <datalist id="subjects">
            {subjects.length > 0 &&
              subjects.map((subject) => {
                return <option value={subject}></option>
              })}
          </datalist>
        </div>

        <Button
          className={`${button.rightBtn} ms-3 mt-1`}
          type="submit"
        >
          Search
        </Button>
      </form>
      {errors &&
      errors.errors.filter((error) => {
        return error.type == "fetchTutor"
      }).length > 0 ? (
        <h3>We do not have any tutors</h3>
      ) : searchingError ? (
        <Fragment>
          <h5 className="text-center mt-4">
            We do not have any in this subject in this department <br />
            <Button
              className={`${button.leftBtn} mt-3`}
              onClick={function () {
                dispatch(fetchTutor())
                setSearchingError("")
              }}
            >
              Reload All Tutors!
            </Button>
          </h5>
        </Fragment>
      ) : (
        tutors.tutors &&
        tutors.tutors.length > 0 && (
          <div className="row row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-md-start justify-content-lg-start">
            {tutors.tutors.map((tutor) => {
              return (
                <div
                  class="col my-4 "
                  style={{ maxWidth: "280px", width: "40%" }}
                >
                  <Tutor
                    key={tutor.id}
                    id={tutor.id}
                    name={tutor.name}
                    department={tutor.department}
                    subject={tutor.subject}
                  />
                </div>
              )
            })}
          </div>
        )
      )}
    </Container>
  )
}

export default TutorPage
