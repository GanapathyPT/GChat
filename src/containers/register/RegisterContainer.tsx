import { Link } from "react-router-dom";
import { Register } from "../../components/registerPage/Register";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../services/auth/AuthContext";

function RegisterContainer() {
  const { register } = useAuth();

  return (
    <AuthLayout
      heading="Register"
      cardContent={<Register onSubmit={register} />}
      extra={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    />
  );
}

export { RegisterContainer };
