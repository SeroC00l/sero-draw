import { useState, FormEvent, createContext, useContext } from "react";
import { ZodType, ZodTypeDef } from "zod";
import { FieldError } from "./errors/field-error";
import { validateSchema } from "@/lib/utils";

interface FormProps<T extends ZodType<any, ZodTypeDef, any>>
  extends React.FormHTMLAttributes<HTMLFormElement> {
  schema: T;
  onSubmit?: (values: T["_output"]) => void | Promise<void>;
  action?: (values: T["_output"]) => void | Promise<void>;
  initialValues?: { [key: string]: any };
}

interface FormContextType {
  values: { [key: string]: any };
  errors: { [key: string]: string };
  setValues: (values: { [key: string]: any }) => void;
  setErrors: (errors: { [key: string]: string }) => void;
  validate: () => boolean;
}

const FormContext = createContext<FormContextType>({} as FormContextType);

export const useFromContext = () => {
  return useContext(FormContext);
};

export function Form<T extends ZodType<any, ZodTypeDef, any>>({
  schema,
  onSubmit,
  action,
  initialValues = {},
  ...props
}: FormProps<T>) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [values, setValues] = useState<{ [key: string]: any }>(initialValues);

  const validate = () => {
    const newErrors = validateSchema(schema, values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (action) {
        await action(values);
      } else if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      if (error instanceof FieldError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [error.fieldName]: error.message,
        }));
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <FormContext.Provider
      value={{ values, errors, setValues, setErrors, validate }}
    >
      <form onSubmit={handleSubmit} {...props} />
    </FormContext.Provider>
  );
}
