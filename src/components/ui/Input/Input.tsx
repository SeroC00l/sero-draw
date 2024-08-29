import { cn } from "@/lib/utils";
import { FormField } from "../Form/FormField";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  message?: React.ReactNode;
  variant?: "default" | "secondary";
}

export const Input = ({
  name,
  message,
  className,
  variant,
  ...props
}: InputProps) => {
  const variantClassName = variant === "secondary" ? styles.secondary : styles.default;

  return (
    <FormField name={name} message={message}>
      {(field) => {
        const inputClassName = cn(
          className,
          styles.input,
          variantClassName,
          field.error && styles.error
        );
        return <input {...field} {...props} className={inputClassName} />;
      }}
    </FormField>
  );
};
