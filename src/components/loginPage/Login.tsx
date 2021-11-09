import { useState } from "react";
import { Button, Form } from "semantic-ui-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form>
      <Form.Input
        label="Email"
        placeholder="email"
        icon="mail"
        iconPosition="left"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Form.Input
        label="Password"
        placeholder="password"
        type="password"
        icon="key"
        iconPosition="left"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* <Divider horizontal>or</Divider>
      <Form.Field>
        <GoogleLogin
            clientId={
                process.env.REACT_APP_GOOGLE_CLIENT_ID as string
            }
            buttonText="Login with Google"
            onSuccess={onSuccess}
            cookiePolicy="single_host_origin"
        />
      </Form.Field> */}
      <Button type="submit" primary>
        Sign In
      </Button>
    </Form>
  );
}

export { Login };
