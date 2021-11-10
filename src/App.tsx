import "semantic-ui-css/semantic.min.css";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { LoginContainer } from "./containers/login/LoginContainer";
import { RegisterContainer } from "./containers/register/RegisterContainer";
import { useEffect } from "react";
import { getToken, Token } from "./common/tokenLocalStorage";
import { AuthStatus, useAuth } from "./services/auth/AuthContext";
import { AppLoader } from "./components/common/AppLoader";

function App() {
  const { authenticate, status } = useAuth();

  useEffect(() => {
    const token = getToken(Token.AcessToken);
    if (token !== null) {
      authenticate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === AuthStatus.AuthenticationLoading) return <AppLoader />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />
        <Route
          path="/"
          element={
            status === AuthStatus.NotAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <>Home</>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
