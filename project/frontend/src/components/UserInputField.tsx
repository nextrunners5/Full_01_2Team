import React from 'react';

interface UserInputFieldProps {
  label: string;
  type: string;
  value: string;
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const UserInputField: React.FC<UserInputFieldProps> = ({
  label,
  type,
  value,
  name,
  onChange,
  placeholder,
}) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default UserInputField;
