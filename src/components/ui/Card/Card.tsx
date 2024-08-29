import { cn } from "@/lib/utils";
import { Stack } from "../Stack/Stack";
import styles from "./Card.module.css";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  col?: boolean;
}

export const Card = ({ children, className, ...props }: Props) => {
  return (
    <Stack className={cn(styles.card, className)} {...props}>
      {children}
    </Stack>
  );
};

export const CardHeader = ({ children, className, ...props }: Props) => {
  return (
    <Stack as="header" className={cn(styles.header, className)} {...props}>
      {children}
    </Stack>
  );
};

export const CardContent = ({ children, className, ...props }: Props) => {
  return (
    <Stack className={cn(styles.content, className)} {...props}>
      {children}
    </Stack>
  );
};

export const CardFooter = ({ children, className, ...props }: Props) => {
  return (
    <Stack as="footer" className={cn(styles.footer, className)} {...props}>
      {children}
    </Stack>
  );
};
