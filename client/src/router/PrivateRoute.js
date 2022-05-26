import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const RequireNormAuth = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (auth.loading) {
    return <h3>Is Loading</h3>;
  } else {
    if (!auth.isAuthenticated) {
      return <Navigate to="/" state={{ from: location }} />;
    }
    return children;
  }
};

export const RequireNotLoggedIn = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  const location = useLocation();

  if (auth.loading) {
    return <h3>Is Loading</h3>;
  } else {
    if (auth.isAuthenticated) {
      return <Navigate to="/tutors" state={{ from: location }} />;
    }

    return children;
  }
};
