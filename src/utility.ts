export const generateArrayRange = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/**
 * Returns a number between min and max (inclusive)
 */
export const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isNumInRange = (num: number, min: number, max: number) => {
  return num >= min && num <= max;
};

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  wait: number
) => {
  let timeoutId: number;
  return (...args: Parameters<T>): void => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
/* eslint-enable */

/* ============= */
/* Utility types */
/* ============= */

// https://fettblog.eu/typescript-match-the-exact-object-shape/
export type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;
