import { Link, useNavigate } from "react-router-dom";
import { Login } from "../../components/loginPage/Login";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../services/auth/AuthContext";

function LoginContainer() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthLayout
      heading="Login"
      cardContent={<Login onSubmit={loginUser} />}
      extra={
        <>
          Don't have an account? <Link to="/register">Register</Link>
        </>
      }
    />
  );
}

export { LoginContainer };
