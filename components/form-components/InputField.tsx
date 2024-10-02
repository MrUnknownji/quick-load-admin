import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  readOnly,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
          readOnly ? "bg-gray-100" : ""
        }`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default InputField;
