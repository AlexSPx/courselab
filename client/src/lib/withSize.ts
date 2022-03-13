export const withSize = (
  url: string,
  { width, height }: { width: string | number; height: string | number }
) => {
  const str = url.split(".");
  if (process.env.NODE_ENV === "production")
    return `${str[1]}_${width}x${height}.${str[2]}`;
  return `${str[0]}_${width}x${height}.${str[1]}`;
};
