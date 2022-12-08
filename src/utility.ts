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
