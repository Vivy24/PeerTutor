import axios from "axios";
import { useState, Fragment } from "react";
import { fetchRequests } from "../../store/tutorActions";
import { useDispatch } from "react-redux";
const Request = ({ email, subject, department, id }) => {
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const approveReq = async (event) => {
    try {
      await axios.post(`api/requests/approve/${event.target.value}`);
      dispatch(fetchRequests());
    } catch (error) {
      setError(error);
    }
  };

  const deleteReq = async (event) => {
    try {
      const res = await axios.delete(`/api/requests/${event.target.value}`);

      dispatch(fetchRequests());
    } catch (error) {
      setError(error);
    }
  };
  return (
    <Fragment>
      {error && (
        <p>
          There is something wrong with this request. Please connect to super
          admin
        </p>
      )}

      <tr>
        <th scope="rol">
          <p> {email}</p>
        </th>
        <td>
          <p> {department}</p>
        </td>
        <td>
          <p> {subject}</p>
        </td>
        <td>
          <button
            style={{
              backgroundColor: "green",
              border: "1px solid green",
              color: "white",
            }}
            value={id}
            onClick={approveReq}
          >
            Approve
          </button>
        </td>
        <td>
          <button
            style={{
              backgroundColor: "red",
              border: "1px solid red",
              color: "white",
            }}
            value={id}
            onClick={deleteReq}
          >
            Delete
          </button>
        </td>
      </tr>
    </Fragment>
  );
};

export default Request;
