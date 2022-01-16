export interface ModalsInterface {
  modals: JSX.Element[];
  setModals: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

export interface UserDataInterface {
  isAuth: boolean;
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
  type: "DOCUMENT" | "VIDEO" | "ASSIGNMENT" | "QUIZZ";
  document_id?: string;
  video_id?: string;
  course_id: string;
  assignment_id?: string;
  quizz_id?: string;
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
