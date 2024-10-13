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

type Info = {
  title: string; // Required
  documentTitle?: string; // Output only
  description?: string;
};

type FormSettings = {
  quizSettings?: QuizSettings;
};

type QuizSettings = {
  isQuiz: boolean;
};

type Item = {
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

type QuestionItem = {
  question: Question;
  image?: Image;
};

type Question = {
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

type ChoiceQuestion = {
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

type Option = {
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

type Image = {
  contentUri?: string; // Output only
  altText?: string;
  properties?: MediaProperties;
  sourceUri?: string; // Input only
};

type MediaProperties = {
  alignment?: Alignment;
  width?: number;
};

enum Alignment {
  ALIGNMENT_UNSPECIFIED = "ALIGNMENT_UNSPECIFIED",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
}

type TextQuestion = {
  paragraph?: boolean;
};

type ScaleQuestion = {
  low: number; // Required
  high: number; // Required
  lowLabel?: string;
  highLabel?: string;
};

type DateQuestion = {
  includeTime?: boolean;
  includeYear?: boolean;
};

type TimeQuestion = {
  duration?: boolean;
};

type FileUploadQuestion = {
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

type RowQuestion = {
  title: string; // Required
};

type Grading = {
  pointValue: number; // Required
  correctAnswers: CorrectAnswers; // Required
  whenRight?: Feedback;
  whenWrong?: Feedback;
  generalFeedback?: Feedback;
};

type CorrectAnswers = {
  answers: CorrectAnswer[];
};

type CorrectAnswer = {
  value: string; // Required
};

type Feedback = {
  // Define Feedback properties here
};

type QuestionGroupItem = {
  questions: Question[]; // Required
  image?: Image;
  grid?: Grid;
};

type Grid = {
  columns: ChoiceQuestion; // Required
  shuffleQuestions?: boolean;
};

type PageBreakItem = {
  // This type has no fields
};

type TextItem = {
  // This type has no fields
};

type ImageItem = {
  image: Image; // Required
};

type VideoItem = {
  video: Video; // Required
  caption?: string;
};

type Video = {
  youtubeUri: string; // Required
  properties?: MediaProperties;
};
