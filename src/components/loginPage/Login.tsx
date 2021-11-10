import { MutableRefObject, useImperativeHandle, useState } from "react";
import { Button, Form, Icon, Label } from "semantic-ui-react";
import styles from "./Login.module.scss";
interface Props {
  ctrlRef: MutableRefObject<
    | {
        setError: (errors: Record<string, string>) => void;
        setLoading: (loading: boolean) => void;
      }
    | undefined
  >;
  onSubmit: (email: string, password: string) => void;
}

function Login({ ctrlRef, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = async () => {
    await onSubmit(email, password);
    setPassword("");
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
      {error.general ? (
        <div className={styles.alertContainer}>
          <Label prompt color="red">
            <Icon name="exclamation circle" />
            {error.general}
          </Label>
        </div>
      ) : null}
      <Form.Input
        required
        label="Email"
        placeholder="email"
        icon="mail"
        iconPosition="left"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      />
      <Button type="submit" primary loading={loading} disabled={loading}>
        Sign In
      </Button>
    </Form>
  );
}

export { Login };
