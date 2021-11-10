import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../../components/loginPage/Login";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../services/auth/AuthContext";

function LoginContainer() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const formControlRef = useRef<{
    setError: (errors: Record<string, string>) => void;
    setLoading: (loading: boolean) => void;
  }>();

  const loginUser = async (email: string, password: string) => {
    try {
      formControlRef.current?.setLoading(true);
      formControlRef.current?.setError({});
      await login(email, password);
      navigate("/");
    } catch (err) {
      formControlRef.current?.setError({ general: "Invalid Credentials" });
      console.error(err);
    } finally {
      formControlRef.current?.setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Login"
      cardContent={<Login ctrlRef={formControlRef} onSubmit={loginUser} />}
      extra={
        <>
          Don't have an account? <Link to="/register">Register</Link>
        </>
      }
    />
  );
}

export { LoginContainer };
