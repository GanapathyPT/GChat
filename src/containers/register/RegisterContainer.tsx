import { Link } from "react-router-dom";
import { Register } from "../../components/registerPage/Register";
import { AuthLayout } from "../../layouts/AuthLayout";

function RegisterContainer() {
  return (
    <AuthLayout
      heading="Register"
      cardContent={<Register />}
      extra={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    />
  );
}

export { RegisterContainer };
