import { Card, Button } from "react-bootstrap";
import styles from "../../public/styles/button.module.css";
import { useNavigate } from "react-router-dom";

const Tutor = ({ id, name, department, subject }) => {
  const navigate = useNavigate();
  const navigateToBookingPage = (event) => {
    navigate(`/booking/${event.target.value}`);
  };

  return (
    <Card className="mb-3 w-100 h-100">
      <img
        src={`https://ui-avatars.com/api/?name=${name.replace(
          " ",
          "+"
        )}&size=128`}
      ></img>
      <h5 className="ms-3 mt-3 text-capitalize" style={{ minHeight: "2em" }}>
        Name: {name}
      </h5>

      <div className="mt-3" style={{ height: "7em" }}>
        <p className="ms-3 text-capitalize">Subject: {subject}</p>
        <p className="ms-3 text-capitalize">Department: {department}</p>
      </div>
      <Button
        onClick={navigateToBookingPage}
        value={id}
        className={`${styles.leftBtn} w-75 mx-auto mb-3`}
      >
        Book me
      </Button>
    </Card>
  );
};

export default Tutor;
