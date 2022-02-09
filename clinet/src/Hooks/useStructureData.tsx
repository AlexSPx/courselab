import axios from "axios";
import { isEqual } from "lodash";
import { SetStateAction, useEffect, useState } from "react";

import { CourseInterface, DataModelInterface } from "../interfaces";
import { baseurl } from "../lib/fetcher";
import { initializeData, prepareData } from "../lib/structureHelpers";
import useRequest from "../lib/useRequest";

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
  getDay: (dayIndex: number) => DataModelInterface[];
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

  const { executeQuery } = useRequest();

  const saveWeeks = async () => {
    const { weeks } = prepareData(data, compareData);

    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/data/save`,
          { weeks, name: course.name },
          { withCredentials: true }
        );
        return res;
      },
      {
        loadingTitle: "Saving Changes",
        successBody: "Changes have been saved",
        onSuccess: () => setCompareData(data),
      }
    );
  };

  const createWeek = () => {
    if (!data) setData([[[], [], [], [], [], [], []]]);
    setData((prev: Data) => [...prev!, [[], [], [], [], [], [], []]]);
  };

  const addFile = (dataModel: DataModelInterface | DataModelInterface[]) => {
    setData((prev) => {
      const temp = prev!;

      if (Array.isArray(dataModel)) {
        dataModel.forEach((dm) => {
          temp[dm.props.week][dm.props.day][dm.props.index] = dm;
        });
        return temp;
      }

      temp[dataModel.props.week][dataModel.props.day][dataModel.props.index] =
        dataModel;

      return temp;
    });
  };

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
    getDay,
    saveWeeks,
    setCurrentWeek,
    addFile,
    delFile,
  };
}
