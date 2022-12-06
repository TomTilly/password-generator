import React, { ChangeEventHandler } from 'react';

export default function InputCheckbox<
  K extends keyof T & string,
  T = Record<string, unknown>
>({
  value,
  id,
  label,
  handleChange,
}: {
  value: boolean;
  id: K;
  label: string;
  handleChange: ChangeEventHandler;
}) {
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        value={value.toString()}
        name={id}
        onChange={handleChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
