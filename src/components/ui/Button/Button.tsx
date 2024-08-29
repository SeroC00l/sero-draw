import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const buttonVariants = ({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) => {
  const variantClassName = {
    default: styles["button-default"],
    destructive: styles["button-destructive"],
    outline: styles["button-outline"],
    secondary: styles["button-secondary"],
    ghost: styles["button-ghost"],
    link: styles["button-link"],
  }[variant];

  const sizeClassName = {
    default: styles["button-default-size"],
    sm: styles["button-sm"],
    lg: styles["button-lg"],
    icon: styles["button-icon"],
  }[size];

  return cn(styles.button, variantClassName, sizeClassName, className);
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
