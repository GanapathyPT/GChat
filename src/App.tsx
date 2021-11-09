import "semantic-ui-css/semantic.min.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { LoginContainer } from "./containers/login/LoginContainer";
import { RegisterContainer } from "./containers/register/RegisterContainer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>Home</>} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
