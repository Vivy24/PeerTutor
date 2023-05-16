import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import DemoteAdmin from "../components/admin/demoteAdmin"
import RegisterAdmin from "../components/admin/registerAdmin"
import Request from "../components/admin/request"
import { FaArrowLeft } from "react-icons/fa"
import { fetchRequests } from "../store/tutorActions"
import { useEffect, useState } from "react"
import axiosConfig from "../axiosconfig"

const DashBoardPage = () => {
  const [user, setUser] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const auth = useSelector((state) => state.auth)
  const tutorSlice = useSelector((state) => state.tutor)
  const requests = tutorSlice.requests
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(auth)

  useEffect(() => {
    if (!auth.loading) {
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchRequests())
  }, [loading])
  useEffect(() => {
    if (loading) {
      if (!auth.loading && !auth.isAuthenticated) {
        navigate("/")
      }

      if (
        !auth.loading &&
        auth.user.role !== "Admin" &&
        auth.user.role !== "SAdmin"
      ) {
        navigate("/")
      }
    }
  }, [loading])
  useEffect(() => {
    if (loading) {
      const getUser = async () => {
        try {
          const res = await axiosConfig.get("/api/meetings/tutor")
          setUser(res.data)
        } catch (error) {
          console.error(error)
          setError(error)
        }
      }
      if (auth.user.role === "SAdmin") {
        getUser()
      }
    }
  }, [auth, loading])
  return (
    <Container>
      <button
        className="mt-3"
        style={{ backgroundColor: "white", border: "none" }}
        onClick={() => navigate("/")}
      >
        <FaArrowLeft style={{ color: "red", fontSize: "2rem" }} />
      </button>
      <div class="row">
        {auth.user && auth.user.role === "SAdmin" && (
          <div class="col-12 col-lg-6">
            <DemoteAdmin users={user} />
            <RegisterAdmin users={user} />
          </div>
        )}
        <div class="col-12 col-lg-6">
          {auth.user &&
            (auth.user.role === "Admin" || auth.user.role === "SAdmin") &&
            (requests.length > 0 ? (
              <table class="table mt-5">
                <thead>
                  <th scope="rol">Email</th>
                  <th scope="rol">Department</th>
                  <th scope="rol">Subject</th>
                  <th scope="rol">Approve</th>
                  <th scope="rol">Delete</th>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    return (
                      <Request
                        key={request.id}
                        email={request.email}
                        department={request.department}
                        subject={request.subject}
                        id={request.id}
                      />
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="mt-5 text-center">No tutor requests</p>
            ))}
        </div>
      </div>
    </Container>
  )
}

export default DashBoardPage
