import { useCallback, useEffect, useState } from "react";

interface LayoutProps {
  css?: string;
}

export const MainLayout: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row w-full h-full justify-center overflow-auto ${css}`}
      id="journal-scroll"
    >
      {children}
    </div>
  );
};

export const Left: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`order-1 justify-center sm:order-none w-auto sm:h-full sm:flex lg:w-1/4 sm:flex-grow p-1 ${css}`}
    >
      {children}
    </div>
  );
};

export const Main: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`order-3 sm:order-none flex w-full h-full sm:w-4/5 lg:w-1/2 p-1 flex-col ${css}`}
    >
      {children}
    </div>
  );
};

export const Right: React.FC<LayoutProps> = ({ children, css }) => {
  const [dropdown, setDropdown] = useState(false);
  const [opened, setOpened] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setDropdown(true);
    } else setDropdown(false);
  }, []);

  useEffect(() => {
    const breaking = 640;
    const media = window.matchMedia(`(max-width: ${breaking}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setDropdown(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, [updateTarget]);

  return (
    <>
      {dropdown ? (
        <div className="flex flex-col max-h-screen">
          <div
            className="flex flex-row w-full h-12 items-center justify-center font-mono cursor-pointer bg-gray-50"
            onClick={() => setOpened(!opened)}
          >
            dropdown
          </div>
          {opened && (
            <div className="justify-center order-none w-full h-full flex">
              {children}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`order-2 justify-center sm:order-none w-auto h-14 sm:h-full sm:flex lg:w-1/4 sm:flex-grow p-1 ${css}`}
        >
          {children}
        </div>
      )}
    </>
  );
};
