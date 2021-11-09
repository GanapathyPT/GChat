import { Link } from "react-router-dom";
import { Login } from "../../components/loginPage/Login";
import { AuthLayout } from "../../layouts/AuthLayout";

function LoginContainer() {
  return (
    <AuthLayout
      heading="Login"
      cardContent={<Login />}
      extra={
        <>
          Don't have an account? <Link to="/register">Register</Link>
        </>
      }
    />
  );
}

export { LoginContainer };
