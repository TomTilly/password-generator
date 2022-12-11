import React from 'react';

export enum StrengthLevels {
  TooWeak,
  Weak,
  Medium,
  Strong,
}

// stackoverflow.com/questions/38034673/determine-the-number-of-enum-elements-typescript
export const strengthMaxLevel = Object.keys(StrengthLevels).length / 2 - 1;
// const strengthLevels = generateArrayRange(0, strengthMaxLevel);

const strengthLevelData = [
  {
    label: 'Too Weak!',
    color: 'text-red',
  },
  {
    label: 'Weak',
    color: 'text-orange',
  },
  {
    label: 'Medium',
    color: 'text-yellow',
  },
  {
    label: 'Strong',
    color: 'text-neon-green',
  },
];

export default function StrengthMeter({
  currentStrength,
}: {
  currentStrength: StrengthLevels | undefined;
}) {
  const hasStrength = currentStrength !== undefined;
  return (
    <div className="item-stretch flex flex-wrap justify-between gap-4 bg-very-dark-grey p-6">
      <div className="font-bold uppercase text-grey">Strength</div>
      <div
        className={`flex gap-1.5 ${
          hasStrength ? strengthLevelData[currentStrength].color : ''
        } items-stretch`}
      >
        {hasStrength ? (
          <span className="mr-1 font-bold uppercase text-almost-white">
            {strengthLevelData[currentStrength].label}
          </span>
        ) : null}
        {strengthLevelData.map((_, strengthLevel) => {
          if (!hasStrength || strengthLevel > currentStrength)
            return (
              <div
                className="border-1 min-h-[1.5rem] w-2 border border-solid border-almost-white bg-transparent"
                key={strengthLevel}
              />
            );

          return (
            <div
              className="border-1 min-h-[1.5rem] w-2 border border-solid border-current bg-current"
              key={strengthLevel}
            />
          );
        })}
      </div>
    </div>
  );
}
