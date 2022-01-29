import React, { useCallback, useEffect, useState } from "react";

const useRightClickContext = (
  outerRef: React.RefObject<HTMLDivElement>,
  { keepStyles }: { keepStyles?: string } = {}
) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      if (outerRef && outerRef.current?.contains(event.target)) {
        setX(event.pageX);
        setY(event.pageY);
        setVisible(true);
        if (keepStyles && !outerRef.current.className.includes(keepStyles))
          outerRef.current.className += ` ${keepStyles}`;
      } else {
        setVisible(false);
      }
    },
    [outerRef, keepStyles]
  );

  const handleClick = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (outerRef.current && keepStyles) {
      if (!visible) {
        outerRef.current.className = outerRef.current.className.replace(
          keepStyles,
          ""
        );
      }
    }
  }, [keepStyles, outerRef, visible]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleClick, handleContextMenu]);

  return { x, y, visible };
};

export default useRightClickContext;
