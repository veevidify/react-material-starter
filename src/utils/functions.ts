export const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

export const head = <T = any>(arr: T[]): Nullable<T> => arr[0] ?? null;
export const tail = <T = any>(arr: T[]): Nullable<T> => arr.length > 0 ? (arr[arr.length - 1]) : null;

export const readEnv = (key: string, fallback = ''): string => process.env[key] ?? fallback;
