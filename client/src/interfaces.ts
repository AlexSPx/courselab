export interface ModalsInterface {
  modals: JSX.Element[];
  setModals: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

export interface UserDataInterface {
  isAuth: boolean | null;
  user?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    socials: null | JSON;
    avatar: string | null;
    email: string;
  } | null;
}

export interface UserContextInterface {
  userData: UserDataInterface;
  setUserData: any;
}

export interface CourseInterface {
  name: string;
  public_name: string;
  published: boolean;
  model: "WEEKLY" | "FREE";
  weeks?: number;
  details: {
    description: string;
  };
  dataModels: DataModelInterface[];
}

export interface DataModelInterface {
  id: string;
  name: string;
  props: {
    week: number;
    day: number;
    index: number;
  };
  type: dataModelType;
  document_id?: string;
  video_id?: string;
  course_id: string;
  assignment_id?: string;
  quiz_id?: string;
}

export interface CourseGeneralInterface {
  name: string;
  public_name: string;
  weeks: number;
  details: {
    description: string;
  };
  videos: number;
  documents: number;
  quizzes: number;
  assignments: number;
}

export interface DocumentInterface {
  id: string;
  name: string;
  file: JSON;
  members: DocumentUser[];
  courseDataModel?: {
    course_id: string;
  };
}

export type dataModelType = "DOCUMENT" | "VIDEO" | "ASSIGNMENT" | "QUIZ";

export interface DocumentUser {
  user: GeneralUserInformation;
  role: "ADMIN" | "EDITOR" | "READER";
  AssignedAt: Date;
}

export interface GeneralUserInformation {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface VideoInterface {
  id: string;
  name: string;
  path: string | null;
  file?: File;
  questions?: VideoQuestion[];
}

export interface VideoQuestion {
  id: string;
  content: string;
  timestamp?: number;
  date: Date;
  VideoAnswers: VideoQuestion[];
  author: GeneralUserInformation;
  answered?: boolean;
  is_answer?: boolean;
  parentQuestionId?: string;
}

export interface AssignmentInterface {
  id: string;
  name: string;
  content: string;
  daysToSubmit: number;
}

export interface QuizInterface {
  id: string;
  name: string;
  description: string;
  questions: QuizzQuestionInterface[];
}

export interface QuizzQuestionInterface {
  id: string;
  question: string;
  type: "CLOSED" | "OPENED";
  answer: string[];
  options: string[];
  orderIndex: number;
}
