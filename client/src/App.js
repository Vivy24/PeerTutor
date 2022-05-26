import "bootstrap/dist/css/bootstrap.min.css";
import "./helpers/logUseroutToken";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import Header from "./components/Header";
import LandingPage from "./pages/landingPage";
import RegisterPage from "./pages/RegisterPage";
import TutorPage from "./pages/TutorPage";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import DashBoardPage from "./pages/DashBoardPage";
import StudentMeetingPage from "./pages/StudentMeetingPage";
import TutorMeetingPage from "./pages/TutorMeetingPage";
import ProfilePage from "./pages/ProfilePage";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Request from "./pages/RequestFormPage";
import { RequireNormAuth, RequireNotLoggedIn } from "./router/PrivateRoute";
import setAuthToken from "./helpers/setAuthToken";
import { loadUser } from "./store/authActions";

function App() {
  const dispatch = useDispatch();
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/register"
          element={
            <RequireNotLoggedIn>
              <Header />
              <RegisterPage />
            </RequireNotLoggedIn>
          }
        />

        <Route
          exact
          path="/login"
          element={
            <RequireNotLoggedIn>
              <Header />
              <LoginPage />
            </RequireNotLoggedIn>
          }
        />

        <Route
          exact
          path="/forgetpassword"
          element={
            <RequireNotLoggedIn>
              <Header />

              <ForgetPassword />
            </RequireNotLoggedIn>
          }
        />

        <Route
          exact
          path="/resetpassword/:id/:token"
          element={
            <RequireNotLoggedIn>
              <Header />
              <ResetPasswordPage />
            </RequireNotLoggedIn>
          }
        />

        <Route
          exact
          path="/booking"
          element={
            <RequireNormAuth>
              <Header />
              <BookingPage />
            </RequireNormAuth>
          }
        />

        <Route
          exact
          path="/tutors"
          element={
            <RequireNormAuth>
              <Header />
              <TutorPage />
            </RequireNormAuth>
          }
        />

        <Route
          exact
          path="/requesttutor"
          element={
            <RequireNormAuth>
              <Header />
              <Request />
            </RequireNormAuth>
          }
        />

        <Route
          exact
          path="booking/:tutorID"
          element={
            <RequireNormAuth>
              <BookingPage />
            </RequireNormAuth>
          }
        />
        <Route exact path="/dashboard" element={<DashBoardPage />} />

        <Route
          exact
          path="/studentMeeting"
          element={
            <RequireNormAuth>
              <StudentMeetingPage />
            </RequireNormAuth>
          }
        />

        <Route
          exact
          path="/tutorMeeting"
          element={
            <RequireNormAuth>
              <TutorMeetingPage />
            </RequireNormAuth>
          }
        />

        <Route
          exact
          path="/edit"
          element={
            <RequireNormAuth>
              <ProfilePage />
            </RequireNormAuth>
          }
        />

        <Route
          exact
          path="/"
          element={
            <RequireNotLoggedIn>
              <Header />
              <LandingPage />
            </RequireNotLoggedIn>
          }
        />

        <Route path="*" element={<h3>Not found page</h3>} />
      </Routes>
    </div>
  );
}

export default App;
