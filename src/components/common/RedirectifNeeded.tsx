import { Navigate } from "react-router";
import { AuthStatus, useAuth } from "../../services/auth/AuthContext";

interface Props {
  element: JSX.Element;
  loggedIn?: boolean;
}

function RedirectifNeeded({ element, loggedIn }: Props) {
  const { status } = useAuth();

  if (status === AuthStatus.Authenticated) {
    if (loggedIn === true) return element;
    else return <Navigate replace to="/" />;
  } else if (status === AuthStatus.NotAuthenticated) {
    if (loggedIn !== true) return element;
    else return <Navigate replace to="/login" />;
  }

  // never gonna hit here but for ts
  return <Navigate replace to="/login" />;
}

export { RedirectifNeeded };
