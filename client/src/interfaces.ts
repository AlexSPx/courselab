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
    isActuve: boolean;
    isAdmin: boolean;
    isVerified: boolean;
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
  scheduleType: CourseScheduleType;
  interval?: number;
  scheduledDates: ScheduleDate[];
  details: {
    description: string;
  };
  dataModels: DataModelInterface[];
}

export type CourseScheduleType = "START_ON_JOIN" | "INTERVAL" | "SCHEDULE";

export interface Enrollment {
  id: string;
  role: "STUDENT" | "ADMIN";
  startingAt: Date;
  assignedAt: Date;
  user: GeneralUserInformation;
  course_id: string;
  course?: CourseInterface;
}

export interface CourseDetails {
  courseName: string;
  images: string[];
  description: string;
  sponsors: Sponsor[];
  reviews: string[];
  course: {
    public_name: string;
    published: boolean;
  };
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
  scheduleType: CourseScheduleType;
  interval?: number;
  scheduledDates: ScheduleDate[];
  videos: number;
  documents: number;
  quizzes: number;
  assignments: number;
}

export interface ScheduleDate {
  startingAt: Date;
  status: "finished" | "ongoing" | "upcoming";
}

export interface Sponsor {
  name: string;
  path: string;
}

export interface DocumentInterface {
  id: string;
  name: string;
  file: JSON;
  members: DocumentUser[];
  courseDataModel?: {
    course: {
      name: string;
      members: Enrollment[];
    };
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

export interface VideoUser {
  id: string;
  role: "ADMIN";
  user_id: string;
  video_id: string;
  AssignedAt: Date;
}

export interface AssignmentInterface {
  id: string;
  name: string;
  content: string;
  files: string[];
  daysToSubmit: number;
  members: AssignmentUsers[];
  submitDate?: Date;
}

export interface AssignmentUsers {
  enrollment_id: string;
  assignment_id: string;
  role: "ADMIN" | "USER" | "EDITOR";
  submits: AssignmentSubmit[];
}

export interface AssignmentSubmit {
  id: string;
  dateOfSubmit: Date;
  dateOfRemoval?: Date;
  returned: boolean;
  comment?: string;
  attachments: AssignmentSubmitAttachment[];
  enrollment_id: string;
  assignment_id: string;
}

export interface AssignmentSubmitAttachment {
  type: "FILE" | "DOCUMENT" | "LINK" | "VIDEO";
  path?: string;
  doc?: {
    type: "DOCUMENT" | "VIDEO";
    name: string;
    id: string;
  };
  link?: string;
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
  points: number;
  orderIndex: number;
}

export interface QuizSubmit {
  id: string;
  Enrollment: Enrollment;
  Quiz: QuizInterface;
  points: number;
  maxPoints: number;
  returned: boolean;
  dateOfSubmit: Date;
  answers: QuizGivenAnswer[];
}

export interface QuizGivenAnswer {
  question: string;
  correct: boolean;
  option: string;
}
