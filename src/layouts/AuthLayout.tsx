import { ReactNode } from "react";
import { Card } from "semantic-ui-react";
import styles from "./AuthLayout.module.scss";

interface Props {
  heading: string;
  cardContent: ReactNode;
  extra?: ReactNode;
}

function AuthLayout({ heading, cardContent, extra }: Props) {
  return (
    <div className={styles.authContainer}>
      <Card color="blue" raised>
        <div className={styles.authCard}>
          <h2 className={styles.authHeading}>{heading}</h2>
          {cardContent}
        </div>
      </Card>

      <small>{extra}</small>
    </div>
  );
}

export { AuthLayout };
