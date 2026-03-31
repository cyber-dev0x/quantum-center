export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
};

export const toPercent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;
