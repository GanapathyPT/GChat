import { MutableRefObject, useImperativeHandle, useState } from "react";
import { Button, Form } from "semantic-ui-react";

interface Props {
  ctrlRef: MutableRefObject<
    | {
        setError: (error: Record<string, string>) => void;
        clearError: () => void;
        clearForm: () => void;
      }
    | undefined
  >;
  onSubmit: (username: string, email: string, password: string) => void;
}

function Register({ ctrlRef, onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  useImperativeHandle(
    ctrlRef,
    () => ({
      setError,
      clearError: () => {
        setError({});
      },
      clearForm: () => {
        setUsername("");
        setEmail("");
        setPassword("");
      },
    }),
    []
  );

  return (
    <Form onSubmit={() => onSubmit(username, email, password)}>
      <Form.Input
        label="UserName"
        placeholder="username"
        icon="user"
        iconPosition="left"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={error.username}
      />
      <Form.Input
        label="Email"
        placeholder="email"
        icon="mail"
        iconPosition="left"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error.email}
      />
      <Form.Input
        label="Password"
        placeholder="password"
        type="password"
        icon="key"
        iconPosition="left"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error.password}
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
