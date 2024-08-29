import * as React from "react";
import styles from "./Stack.module.css";
import { cn } from "@/lib/utils";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  col?: boolean;
  gap?: "xs" | "sm" | "lg";
  as?: React.ElementType;
}

export const Stack = ({
  children,
  col = false,
  gap,
  as: Component = "div",
  className,
  ...props
}: StackProps) => {
  return (
    <Component
      className={cn(
        styles.stack,
        col ? styles.col : styles.row,
        gap ? styles[`gap-${gap}`] : "",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
