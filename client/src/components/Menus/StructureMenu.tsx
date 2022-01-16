import axios from "axios";
import { useState } from "react";
import useRightClickContext from "../../contexts/RightClickMenuContext";
import { DataModelInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { DownArrow, MoveIcon, RightArrow, UpArrow } from "../../svg/small";

export default function StructureMenu({
  outerRef,
  dataModel,
  onDelete,
}: {
  outerRef: React.RefObject<HTMLDivElement>;
  dataModel: DataModelInterface;
  onDelete: (dataModelId: DataModelInterface) => void;
}) {
  const { x, y, visible } = useRightClickContext(outerRef, {
    keepStyles: "bg-gray-600 text-white",
  });

  const [moveMenu, setMoveMenu] = useState(false);

  const handleDelete = async () => {
    const res = await axios.delete(`${baseurl}/course/delete/${dataModel.id}`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      onDelete(dataModel);
    }
  };

  if (visible) {
    return (
      <>
        <div
          className="absolute bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-2  text-gray-500 shadow-lg"
          style={{ top: y, left: x }}
        >
          <div
            className="flex hover:bg-gray-100 justify-between py-1 px-2 rounded cursor-pointer sdropdown"
            onMouseEnter={() => setMoveMenu(true)}
            onMouseLeave={() => setMoveMenu(false)}
          >
            <div className="w-8 text-gray-900">
              <MoveIcon />
            </div>
            <div>Move to another week</div>
            <RightArrow css="w-4 h-4" />
            {moveMenu && (
              <div
                className="absolute flex sdropdown-content bg-white w-32 border border-gray-300 rounded-lg flex-col text-sm py-2 px-1 text-gray-500 shadow-lg"
                style={{ top: 5, left: 239 }}
              >
                <div className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer">
                  <div>to: Week 1</div>
                </div>
                <div className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer">
                  <div>to: Week 1</div>
                </div>
                <div className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer">
                  <div>to: Week 1</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer">
            <div className="w-8 text-gray-900">
              <UpArrow />
            </div>
            <div>Move up</div>
          </div>
          <div className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer">
            <div className="w-8 text-gray-900">
              <DownArrow />
            </div>
            <div>Move down</div>
          </div>
          <div
            className="flex hover:bg-red-100 text-red-700 py-1 px-2 cursor-pointer"
            onClick={handleDelete}
          >
            <div className="w-8 text-gray-900">{/* <DownArrow /> */}</div>
            <div>Delete</div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
