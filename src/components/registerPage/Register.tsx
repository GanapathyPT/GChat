import { MutableRefObject, useImperativeHandle, useState } from "react";
import { Button, Form } from "semantic-ui-react";

interface Props {
  ctrlRef: MutableRefObject<
    | {
        setError: (error: Record<string, string>) => void;
        setLoading: (loading: boolean) => void;
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
  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async () => {
    setPassword("");
    await onSubmit(username, email, password);
  };

  useImperativeHandle(
    ctrlRef,
    () => ({
      setError,
      setLoading,
    }),
    []
  );

  return (
    <Form onSubmit={onFormSubmit}>
      <Form.Input
        required
        label="UserName"
        placeholder="username"
        type="text"
        icon="user"
        iconPosition="left"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={error.username}
      />
      <Form.Input
        required
        label="Email"
        type="email"
        inputmode="email"
        placeholder="email"
        icon="mail"
        iconPosition="left"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error.email}
      />
      <Form.Input
        required
        label="Password"
        placeholder="password"
        type="password"
        icon="key"
        iconPosition="left"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error.password}
      />
      <Button type="submit" primary loading={loading} disabled={loading}>
        Sign Up
      </Button>
    </Form>
  );
}

export { Register };
