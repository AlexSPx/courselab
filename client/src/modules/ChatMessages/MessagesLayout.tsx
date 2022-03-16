import SideBar from "../Layouts/SideBar";

export const MessagesLayout: React.FC = ({ children }) => {
  return (
    <div
      className="flex flex-row w-full h-full overflow-auto bg-gray-50"
      id="journal-scroll"
    >
      <SideBar css="bg-white w-[30rem]"></SideBar>
      <div
        className="flex flex-col w-full h-full items-center overflow-auto"
        id="journal-scroll"
      >
        {children}
      </div>
    </div>
  );
};
