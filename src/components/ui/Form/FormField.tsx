import { useField } from "@/hooks/useField";
import { Stack } from "../Stack/Stack";

interface Field {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

export interface FormFieldProps {
  name: string;
  children: (field: Field) => React.ReactNode;
  message?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  children,
  message,
}) => {
  const { value, setValue, ...field } = useField(name);

  let renderValue: string;
  if (value instanceof File) {
    renderValue = "";
  } else if (typeof value === "object") {
    renderValue = JSON.stringify(value);
  } else {
    renderValue = value;
  }

  return (
    <Stack col style={{ flex: 1 }}>
      {children({
        name,
        ...field,
        value: renderValue,
      })}
      {
        <Stack
          style={{
            color: "var(--destructive)",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{field.error}</span>
          {message}
        </Stack>
      }
    </Stack>
  );
};
