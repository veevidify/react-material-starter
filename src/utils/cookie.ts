const convertMapToCookieString = (map: GOb): string => {
  const newCookie = Object.entries(map)
    .map((kvArr) => kvArr[0] + '=' + kvArr[1])
    .join(';');

  return newCookie;
};

export const readCookieKey = (key: string): Nullable<string> => {
  const deserialisedCookie = document.cookie
    .split(';')
    .filter((keyValue) => keyValue !== '')
    .map((keyValue: string) => keyValue.trim().split('='));

  const cookieMap: GOb = deserialisedCookie.reduce(
    (cookieMap, kvArr) => ({ ...cookieMap, [kvArr[0]]: kvArr[1] }),
    {}
  );
  const cookieKey = cookieMap[key] ?? null;

  return cookieKey;
};

export const updateCookieKey = (
  key: string,
  value: string,
  expires?: Date
): void & Effect<LocalStorageAction> => {
  const cookieMap = {
    [key]: value,
  };
  expires && (cookieMap['expires'] = expires.toUTCString());
  const cookieString = convertMapToCookieString(cookieMap);

  document.cookie = cookieString;
};

export const clearCookieKey = (key: string): void & Effect<LocalStorageAction> => {
  const cookieMap = {
    [key]: '',
  };

  const cookieString = convertMapToCookieString(cookieMap);

  document.cookie = cookieString;
};
