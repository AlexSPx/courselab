type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift";
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
  readonly length: L;
  [I: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
};

export const withSize = (
  url: string,
  { width, height }: { width: string | number; height: string | number }
) => {
  const str = url.split(".");
  return `${str[0]}_${width}x${height}.${str[1]}`;
};
