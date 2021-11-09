import { useState } from "react";
import { Button, Form } from "semantic-ui-react";

interface Props {
  onSubmit: (username: string, email: string, password: string) => void;
}

function Register({ onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form onSubmit={() => onSubmit(username, email, password)}>
      <Form.Input
        label="UserName"
        placeholder="username"
        icon="user"
        iconPosition="left"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
        <Form.Field className="btn__center">
            <GoogleLogin
                clientId={
                    process.env.REACT_APP_GOOGLE_CLIENT_ID as string
                }
                buttonText="Register with Google"
                onSuccess={onSuccess}
                cookiePolicy="single_host_origin"
            />
        </Form.Field> */}
      <Button type="submit" primary>
        Sign Up
      </Button>
    </Form>
  );
}

export { Register };
