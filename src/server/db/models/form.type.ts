export type BatchUpdateFormResponse = {
  form?: Form;
  replies: Array<{
    createItem?: {
      itemId: string;
      questionId: string[];
    };
  }>;
  writeControl?: {
    requiredRevisionId?: string;
    targetRevisionId?: string;
  };
};

export type Form = {
  formId: string; // Output only
  info: Info; // Required
  settings?: FormSettings;
  items?: Item[];
  revisionId?: string; // Output only
  responderUri?: string; // Output only
  linkedSheetId?: string; // Output only
};

export type Info = {
  title: string; // Required
  documentTitle?: string; // Output only
  description?: string;
};

export type FormSettings = {
  quizSettings?: QuizSettings;
};

export type QuizSettings = {
  isQuiz: boolean;
};

export type Item = {
  itemId?: string;
  title?: string;
  description?: string;
  questionItem?: QuestionItem;
  questionGroupItem?: QuestionGroupItem;
  pageBreakItem?: PageBreakItem;
  textItem?: TextItem;
  imageItem?: ImageItem;
  videoItem?: VideoItem;
};

export type QuestionItem = {
  question: Question;
  image?: Image;
};

export type Question = {
  questionId?: string; // Read only
  required?: boolean;
  grading?: Grading;
  choiceQuestion?: ChoiceQuestion;
  textQuestion?: TextQuestion;
  scaleQuestion?: ScaleQuestion;
  dateQuestion?: DateQuestion;
  timeQuestion?: TimeQuestion;
  fileUploadQuestion?: FileUploadQuestion;
  rowQuestion?: RowQuestion;
};

export type ChoiceQuestion = {
  type: ChoiceType; // Required
  options: Option[]; // Required
  shuffle?: boolean;
};

enum ChoiceType {
  CHOICE_TYPE_UNSPECIFIED = "CHOICE_TYPE_UNSPECIFIED",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  DROP_DOWN = "DROP_DOWN",
}

export type Option = {
  value: string; // Required
  image?: Image;
  isOther?: boolean;
  goToAction?: GoToAction;
  goToSectionId?: string;
};

enum GoToAction {
  GO_TO_ACTION_UNSPECIFIED = "GO_TO_ACTION_UNSPECIFIED",
  NEXT_SECTION = "NEXT_SECTION",
  RESTART_FORM = "RESTART_FORM",
  SUBMIT_FORM = "SUBMIT_FORM",
}

export type Image = {
  contentUri?: string; // Output only
  altText?: string;
  properties?: MediaProperties;
  sourceUri?: string; // Input only
};

export type MediaProperties = {
  alignment?: Alignment;
  width?: number;
};

export enum Alignment {
  ALIGNMENT_UNSPECIFIED = "ALIGNMENT_UNSPECIFIED",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
}

export type TextQuestion = {
  paragraph?: boolean;
};

export type ScaleQuestion = {
  low: number; // Required
  high: number; // Required
  lowLabel?: string;
  highLabel?: string;
};

export type DateQuestion = {
  includeTime?: boolean;
  includeYear?: boolean;
};

export type TimeQuestion = {
  duration?: boolean;
};

export type FileUploadQuestion = {
  folderId: string; // Required
  types?: FileType[];
  maxFiles?: number;
  maxFileSize?: string;
};

enum FileType {
  FILE_TYPE_UNSPECIFIED = "FILE_TYPE_UNSPECIFIED",
  ANY = "ANY",
  DOCUMENT = "DOCUMENT",
  PRESENTATION = "PRESENTATION",
  SPREADSHEET = "SPREADSHEET",
  DRAWING = "DRAWING",
  PDF = "PDF",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
}

export type RowQuestion = {
  title: string; // Required
};

export type Grading = {
  pointValue: number; // Required
  correctAnswers: CorrectAnswers; // Required
  whenRight?: Feedback;
  whenWrong?: Feedback;
  generalFeedback?: Feedback;
};

export type CorrectAnswers = {
  answers: CorrectAnswer[];
};

export type CorrectAnswer = {
  value: string; // Required
};

export type Feedback = {
  // Define Feedback properties here
};

export type QuestionGroupItem = {
  questions: Question[]; // Required
  image?: Image;
  grid?: Grid;
};

export type Grid = {
  columns: ChoiceQuestion; // Required
  shuffleQuestions?: boolean;
};

export type PageBreakItem = {
  // This export type has no fields
};

export type TextItem = {
  // This export type has no fields
};

export type ImageItem = {
  image: Image; // Required
};

export type VideoItem = {
  video: Video; // Required
  caption?: string;
};

export type Video = {
  youtubeUri: string; // Required
  properties?: MediaProperties;
};
