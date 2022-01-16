import axios from "axios";
import { isEqual } from "lodash";
import { SetStateAction, useEffect, useState } from "react";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../components/Modal";
import { CourseInterface, DataModelInterface } from "../interfaces";
import { baseurl } from "../lib/fetcher";
import { addWeek, initializeData, prepareData } from "../lib/structureHelpers";
import { filter } from "lodash";

export type Data = Array<Array<DataModelInterface[]>> | null;

export type StructureData = {
  data: Data;
  currentWeek: number;
  changes: boolean;
  courseName: string;
  createWeek: () => void;
  addFile: (dataModel: DataModelInterface) => void;
  delFile: (dataModelId: DataModelInterface) => void;
  getWeek: () => DataModelInterface[][];
  saveWeeks: () => Promise<void>;
  setCurrentWeek: React.Dispatch<SetStateAction<number>>;
};

export default function useStructureData(
  course: CourseInterface
): StructureData {
  const [compareData, setCompareData] = useState<Data>(initializeData(course));
  const [data, setData] = useState<Data>(initializeData(course));
  const [currentWeek, setCurrentWeek] = useState(0);

  const [changes, setChanges] = useState(true);

  useEffect(() => {
    setChanges(isEqual(data, compareData));
  }, [compareData, data]);

  const { pushModal, closeAll } = useModals();

  const saveWeeks = async () => {
    const { weeks } = prepareData(data, compareData);

    pushModal(<LoadingModal title="Saving Changes" body="Saving..." />, {
      timer: false,
    });

    try {
      const saveRes = await axios.post(
        `${baseurl}/course/data/save`,
        { weeks, name: course.name },
        { withCredentials: true }
      );

      if (saveRes.status === 200) {
        closeAll();
        pushModal(
          <SuccessModal title="Success" body="Changes have been saved" />
        );
        setCompareData(data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          closeAll();
          pushModal(<ErrorModal title="Error" body={error.response.data} />);
        }
      } else {
        pushModal(
          <ErrorModal title="Error" body="An unexpected error has occurred" />
        );
      }
    }
  };

  const createWeek = () => {
    if (!data) setData([[[], [], [], [], [], [], []]]);
    setData((prev: Data) => [...prev!, [[], [], [], [], [], [], []]]);
  };

  const addFile = (dataModel: DataModelInterface) => {
    setData((prev) => {
      const temp = prev!;

      temp[dataModel.props.week][dataModel.props.day][dataModel.props.index] =
        dataModel;

      return temp;
    });
  };
  console.log(data);

  const delFile = (dataModel: DataModelInterface) => {
    setData(
      data!.map((w) => w.map((d) => d.filter((i) => i.id !== dataModel.id)))
    );
  };

  const getWeek = () => {
    return data![currentWeek];
  };

  const getDay = (dayIndex: number) => {
    return data![currentWeek][dayIndex];
  };

  const getFile = (dayIndex: number, fileIndex: number) => {
    return data![currentWeek][dayIndex][fileIndex];
  };

  const moveFileUp = (fileIndex: number) => {
    if (fileIndex === 0) return;

    const fileData = data![fileIndex];
    setData((dt) => dt!.splice(fileIndex - 1, 0, dt!.splice(fileIndex, 1)[0]));

    console.log(data);
  };

  return {
    data,
    currentWeek,
    changes,
    courseName: course.name,
    createWeek,
    getWeek,
    saveWeeks,
    setCurrentWeek,
    addFile,
    delFile,
  };
}
