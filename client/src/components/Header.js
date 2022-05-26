import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import style from "../public/styles/Header.module.css";
import btnStyle from "../public/styles/button.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { logOut } from "../store/authActions";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [setLoading] = useState(false);

  useEffect(() => {
    if (!auth.user && auth.isAuthenticated) {
      window.location.reload();
      setLoading(true);
    }
  }, [auth]);

  const logOutUser = async () => {
    await dispatch(logOut());
    navigate("/");
  };
  return (
    !auth.loading && (
      <Navbar className={style.navBar} expand="md">
        <Container>
          <Navbar.Brand>
            <NavLink
              style={{ color: "red", textDecoration: "none" }}
              to={auth.isAuthenticated ? "/tutors" : "/"}
            >
              Peer-2-Peer Tutor
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className={style.collapeNav} id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {auth.loading || (!auth.loading && !auth.isAuthenticated) ? (
                <Fragment>
                  <Nav.Link className={style.navLink}>
                    <NavLink
                      style={{ textDecoration: "none", color: "black" }}
                      to="/register"
                    >
                      Register
                    </NavLink>
                  </Nav.Link>
                  <Nav.Link className={style.navLink}>
                    <NavLink
                      style={{ textDecoration: "none", color: "black" }}
                      to="/login"
                    >
                      Log In
                    </NavLink>
                  </Nav.Link>
                </Fragment>
              ) : (
                <Fragment>
                  {auth.user &&
                    (auth.user.role === "Student" ||
                      auth.user.role === "Tutor") && (
                      <Button
                        className={`${btnStyle.leftBtn} mx-2 mt-2`}
                        onClick={() => {
                          navigate("/studentMeeting");
                        }}
                      >
                        Booked Meeting
                      </Button>
                    )}

                  {auth.user &&
                    auth.user.role !== "Tutor" &&
                    auth.user.role !== "SAdmin" &&
                    auth.user.role !== "Admin" && (
                      <Button
                        className={`${btnStyle.leftBtn} mx-2 mt-2`}
                        onClick={() => {
                          navigate("/requesttutor");
                        }}
                      >
                        Be A Tutor
                      </Button>
                    )}

                  {auth.user && auth.user.role == "Tutor" && (
                    <Fragment>
                      <Button
                        className={`${btnStyle.leftBtn} mx-2 mt-2`}
                        onClick={() => {
                          navigate("/tutorMeeting");
                        }}
                      >
                        Pending Meeting
                      </Button>

                      <Button
                        className={`${btnStyle.leftBtn} mx-2 mt-2`}
                        onClick={() => {
                          navigate("/edit");
                        }}
                      >
                        Change Subject
                      </Button>
                    </Fragment>
                  )}
                  {auth.user &&
                    (auth.user.role === "Admin" ||
                      auth.user.role === "SAdmin") && (
                      <Button
                        className={`${btnStyle.leftBtn} mx-2 mt-2`}
                        onClick={() => {
                          navigate("/dashboard");
                        }}
                      >
                        Dash Board
                      </Button>
                    )}

                  <Button
                    className={`${btnStyle.leftBtn} mx-2 mt-2`}
                    onClick={logOutUser}
                  >
                    Log Out
                  </Button>
                </Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  );
};

export default Header;
