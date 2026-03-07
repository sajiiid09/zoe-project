import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const TextField = ({ label, hint, className, id, ...props }: TextFieldProps) => {
  const fieldId = id ?? props.name;

  return (
    <label className="field" htmlFor={fieldId}>
      {label ? <span className="field-label">{label}</span> : null}
      <input id={fieldId} className={cn("field-input", className)} {...props} />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
};
