import React, { ReactElement } from 'react';

export default function SubmitButton({
  className,
  children,
}: {
  className?: string;
  children?: (string | ReactElement)[] | (string | ReactElement);
}) {
  return (
    <button
      type="submit"
      className={`border border-neon-green bg-neon-green p-4 uppercase text-dark-grey hover:bg-transparent hover:text-neon-green ${
        className ?? ''
      }`}
    >
      {children}
    </button>
  );
}
