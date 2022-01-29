import { RefObject, useCallback, useEffect } from "react";

export default function useOnOutsideClick(
  ref: RefObject<HTMLBodyElement>,
  event: any
) {
  const escapeListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        event();
      }
    },
    [event]
  );
  const clickListener = useCallback(
    (e: MouseEvent) => {
      const el = ref?.current;
      if (!el || !el.contains(e.target as Node)) {
        event();
      }
    },
    [event, ref]
  );
  useEffect(() => {
    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", escapeListener);
    return () => {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", escapeListener);
    };
  }, [clickListener, escapeListener]);
}
