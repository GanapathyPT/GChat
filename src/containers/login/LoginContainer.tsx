import { Link } from "react-router-dom";
import { Login } from "../../components/loginPage/Login";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../services/auth/AuthContext";

function LoginContainer() {
  const { login } = useAuth();

  return (
    <AuthLayout
      heading="Login"
      cardContent={<Login onSubmit={login} />}
      extra={
        <>
          Don't have an account? <Link to="/register">Register</Link>
        </>
      }
    />
  );
}

export { LoginContainer };
