import React, { ChangeEventHandler } from 'react';
import { ReactComponent as IconCheck } from '@assets/images/icon-check.svg';

export default function InputCheckbox({
  value,
  id,
  label,
  handleChange,
}: {
  value: boolean;
  id: string;
  label: string;
  handleChange: ChangeEventHandler;
}) {
  return (
    <label className="grid grid-cols-[1em_auto] items-center gap-6">
      <div className="grid aspect-square w-full cursor-pointer place-items-center">
        <input
          type="checkbox"
          id={id}
          checked={value}
          name={id}
          onChange={handleChange}
          className="col-start-1 row-start-1 h-full w-full cursor-pointer appearance-none border-2 border-almost-white checked:border-neon-green checked:bg-neon-green"
        />
        <IconCheck className="col-start-1 row-start-1 h-auto w-2/3 text-dark-grey" />
      </div>
      <div className="cursor-pointer">{label}</div>
    </label>
  );
}
