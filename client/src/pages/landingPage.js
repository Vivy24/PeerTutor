import Introduction from "../components/landing/Introduction";
import { Container, Row, Col } from "react-bootstrap";
import Image from "../public/img/tutorImage.jpg";
import styles from "../public/styles/Landingpage.module.css";
import { NavLink } from "react-router-dom";

const landingPage = () => {
  return (
    <Container className="container">
      <Row>
        <Col className={styles.intro}>
          <Introduction />
          <Row xs={3} className={styles.btn}>
            <Col>
              <NavLink to="/register" className={styles.leftBtn}>
                Register
              </NavLink>
            </Col>
            <Col>
              <NavLink to="login" className={styles.rightBtn}>
                Log In
              </NavLink>
            </Col>
          </Row>
        </Col>

        <Col className={styles.image}>
          <img
            src={Image}
            style={{
              width: "550px",
              height: "700px",
              marginTop: "20px",
            }}
            alt="student tutoring"
          ></img>
        </Col>
      </Row>
    </Container>
  );
};

export default landingPage;
