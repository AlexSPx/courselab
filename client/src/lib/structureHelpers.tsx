import { differenceBy } from "lodash";
import { CourseInterface, DataModelInterface } from "../interfaces";

type Data = DataModelInterface[][][] | null;

type prepareData = {
  weeks: number;
};

export const initializeData = (course: CourseInterface): Data => {
  const weeks = course.weeks;
  if (!weeks) return null;
  const init: Array<Array<DataModelInterface[]>> = new Array();
  for (let index = 0; index < weeks; index++) {
    init[index] = [[], [], [], [], [], [], []];
  }

  course.dataModels.forEach((dmodel) => {
    init[dmodel.props.week][dmodel.props.day][dmodel.props.index] = dmodel;
  });

  return init;
};

export const addWeek = (
  setData: React.Dispatch<React.SetStateAction<Data>>
) => {
  setData((prev: Data) => {
    if (!prev) return [[[], [], [], [], [], [], []]];
    return [...prev, [[], [], [], [], [], [], []]];
  });
};

export const prepareData = (data: Data, compare: Data): prepareData => {
  if (!compare) return convert(data);
  console.warn(differenceBy(data, compare));
  return { weeks: data!.length };
};

const convert = (data: Data): prepareData => {
  const weeks = data!.length;

  return { weeks };
};
