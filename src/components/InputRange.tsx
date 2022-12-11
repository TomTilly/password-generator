import React, { ChangeEvent, useLayoutEffect, useRef } from 'react';

/**
 * Unpleasant, but needed to style the progress part of a ranged input on
 * Chrome, Safari, Opera, and Edge
 * See https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider
 */
function drawRangeBackground(rangeEl: HTMLInputElement) {
  const [value, min, max] = [rangeEl.value, rangeEl.min, rangeEl.max].map(
    Number
  ); // Cast to numbers

  const gradientProgressStop = ((value - min) / (max - min)) * 100;
  const newBackground = `linear-gradient(to right, hsl(var(--neon-green)) 0%, hsl(var(--neon-green)) ${gradientProgressStop}%, hsl(var(--very-dark-grey)) ${gradientProgressStop}%, hsl(var(--very-dark-grey)) 100%`;
  rangeEl.style.background = newBackground;
}

export default function InputRange({
  min,
  max,
  value,
  onChange,
  id,
  name,
  label,
  className,
  step = 1,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
  id: string;
  name: string;
  label: string;
  className?: string;
  step?: number;
}) {
  const rangeEl = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (rangeEl.current !== null) {
      drawRangeBackground(rangeEl.current);
    }
  }, []);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    drawRangeBackground(e.currentTarget);
    onChange(e);
  };

  return (
    <>
      <div className="flex justify-between">
        <label htmlFor="charLength">{label}</label>
        <div className="text-lg text-neon-green">{value}</div>
      </div>
      <input
        type="range"
        className={`input-range ${className ?? ''}`}
        name={name}
        id={id}
        step={step}
        ref={rangeEl}
        min={min}
        max={max}
        value={value}
        onChange={handleRangeChange}
      />
    </>
  );
}
