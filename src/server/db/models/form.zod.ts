import { z } from "zod";

// Enums
const ChoiceTypeEnum = z.enum([
  "CHOICE_TYPE_UNSPECIFIED",
  "RADIO",
  "CHECKBOX",
  "DROP_DOWN",
]);
const GoToActionEnum = z.enum([
  "GO_TO_ACTION_UNSPECIFIED",
  "NEXT_SECTION",
  "RESTART_FORM",
  "SUBMIT_FORM",
]);
const AlignmentEnum = z.enum([
  "ALIGNMENT_UNSPECIFIED",
  "LEFT",
  "RIGHT",
  "CENTER",
]);
const FileTypeEnum = z.enum([
  "FILE_TYPE_UNSPECIFIED",
  "ANY",
  "DOCUMENT",
  "PRESENTATION",
  "SPREADSHEET",
  "DRAWING",
  "PDF",
  "IMAGE",
  "VIDEO",
  "AUDIO",
]);

// Helper schemas
const ImageSchema = z.object({
  contentUri: z.string().optional(),
  altText: z.string().optional(),
  properties: z
    .object({
      alignment: AlignmentEnum.optional(),
      width: z.number().optional(),
    })
    .optional(),
  sourceUri: z.string().optional(),
});

const VideoSchema = z.object({
  youtubeUri: z.string(),
  properties: z
    .object({
      alignment: AlignmentEnum.optional(),
      width: z.number().optional(),
    })
    .optional(),
});

const OptionSchema = z.object({
  value: z.string(),
  image: ImageSchema.optional(),
  isOther: z.boolean().optional(),
  goToAction: GoToActionEnum.optional(),
  goToSectionId: z.string().optional(),
});

const QuestionSchema = z.object({
  questionId: z.string().optional(),
  required: z.boolean().optional(),
  grading: z
    .object({
      pointValue: z.number(),
      correctAnswers: z.object({
        answers: z.array(z.object({ value: z.string() })),
      }),
      whenRight: z.any().optional(), // Define Feedback type if needed
      whenWrong: z.any().optional(), // Define Feedback type if needed
      generalFeedback: z.any().optional(), // Define Feedback type if needed
    })
    .optional(),
  choiceQuestion: z
    .object({
      type: ChoiceTypeEnum,
      options: z.array(OptionSchema),
      shuffle: z.boolean().optional(),
    })
    .optional(),
  textQuestion: z
    .object({
      paragraph: z.boolean().optional(),
    })
    .optional(),
  scaleQuestion: z
    .object({
      low: z.number(),
      high: z.number(),
      lowLabel: z.string().optional(),
      highLabel: z.string().optional(),
    })
    .optional(),
  dateQuestion: z
    .object({
      includeTime: z.boolean().optional(),
      includeYear: z.boolean().optional(),
    })
    .optional(),
  timeQuestion: z
    .object({
      duration: z.boolean().optional(),
    })
    .optional(),
  fileUploadQuestion: z
    .object({
      folderId: z.string(),
      types: z.array(FileTypeEnum).optional(),
      maxFiles: z.number().optional(),
      maxFileSize: z.string().optional(),
    })
    .optional(),
  rowQuestion: z
    .object({
      title: z.string(),
    })
    .optional(),
});

// Item schema
const ItemSchema = z.object({
  itemId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  questionItem: z
    .object({
      question: QuestionSchema,
      image: ImageSchema.optional(),
    })
    .optional(),
  questionGroupItem: z
    .object({
      questions: z.array(QuestionSchema),
      image: ImageSchema.optional(),
      grid: z
        .object({
          columns: z.object({
            type: ChoiceTypeEnum,
            options: z.array(OptionSchema),
            shuffle: z.boolean().optional(),
          }),
          shuffleQuestions: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  pageBreakItem: z.object({}).optional(),
  textItem: z.object({}).optional(),
  imageItem: z.object({ image: ImageSchema }).optional(),
  videoItem: z.object({
    video: VideoSchema,
    caption: z.string().optional(),
  }),
});

// Main schemas
export const BatchUpdateFormRequestSchema = z.object({
  includeFormInResponse: z.boolean().optional(),
  requests: z.array(
    z.object({
      updateFormInfo: z
        .object({
          info: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
          }),
          updateMask: z.string(),
        })
        .optional(),
      updateSettings: z
        .object({
          settings: z.object({
            quizSettings: z
              .object({
                isQuiz: z.boolean(),
              })
              .optional(),
          }),
          updateMask: z.string(),
        })
        .optional(),
      createItem: z
        .object({
          item: ItemSchema,
          location: z.object({
            index: z.number(),
          }),
        })
        .optional(),
      moveItem: z
        .object({
          originalLocation: z.object({
            index: z.number(),
          }),
          newLocation: z.object({
            index: z.number(),
          }),
        })
        .optional(),
      deleteItem: z
        .object({
          location: z.object({
            index: z.number(),
          }),
        })
        .optional(),
      updateItem: z
        .object({
          item: ItemSchema,
          location: z.object({
            index: z.number(),
          }),
          updateMask: z.string(),
        })
        .optional(),
    }),
  ),
  writeControl: z
    .object({
      requiredRevisionId: z.string().optional(),
      targetRevisionId: z.string().optional(),
    })
    .optional(),
});

const InfoSchema = z.object({
  title: z.string(),
  documentTitle: z.string().optional(),
  description: z.string().optional(),
});

const QuizSettingsSchema = z.object({
  isQuiz: z.boolean(),
});

const FormSettingsSchema = z.object({
  quizSettings: QuizSettingsSchema.optional(),
});

export const FormSchema = z.object({
  formId: z.string(),
  info: InfoSchema,
  settings: FormSettingsSchema.optional(),
  items: z.array(ItemSchema).optional(),
  revisionId: z.string().optional(),
  responderUri: z.string().optional(),
  linkedSheetId: z.string().optional(),
});

// AI Structured Response schema
export const BatchUpdateAIResponseSchema = z.object({
  request: BatchUpdateFormRequestSchema.optional(),
  message: z.string(),
});

// TypeScript types
export type BatchUpdateFormRequest = z.infer<
  typeof BatchUpdateFormRequestSchema
>;
