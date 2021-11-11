import "semantic-ui-css/semantic.min.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { LoginContainer } from "./containers/login/LoginContainer";
import { RegisterContainer } from "./containers/register/RegisterContainer";
import { useEffect } from "react";
import { getToken, Token } from "./common/tokenLocalStorage";
import { AuthStatus, useAuth } from "./services/auth/AuthContext";
import { AppLoader } from "./components/common/AppLoader";
import { RedirectifNeeded } from "./components/common/RedirectifNeeded";
import { Home } from "./components/home/Home";

function App() {
  const { authenticate, status } = useAuth();

  useEffect(() => {
    const token = getToken(Token.AcessToken);
    authenticate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === AuthStatus.AuthenticationLoading) return <AppLoader />;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<RedirectifNeeded element={<LoginContainer />} />}
        />
        <Route
          path="/register"
          element={<RedirectifNeeded element={<RegisterContainer />} />}
        />
        <Route
          path="/"
          element={<RedirectifNeeded element={<Home />} loggedIn />}
        />
      </Routes>
    </Router>
  );
}

export default App;
