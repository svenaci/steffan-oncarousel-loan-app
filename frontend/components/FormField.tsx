type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  type?: "text" | "email" | "number";
  placeholder?: string;
};

export default function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  placeholder,
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={hasError}
        className={`border rounded px-3 py-2 ${hasError ? "border-red-500" : "border-gray-300"}`}
      />

      {hasError && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}