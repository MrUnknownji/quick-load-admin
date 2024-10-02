import React from "react";

interface SelectFieldProps {
  label: string;
  name?: string; // Add this line
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  readOnly?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name, // Add this line
  options,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name} // Add this line
          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 appearance-none ${
            readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
          value={value}
          onChange={onChange}
          disabled={readOnly}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectField;
