"use client";

import { BotIcon, CopyIcon, LinkIcon, Loader2Icon, PlusIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { generateForm } from "~/server/ai";
import { updateFormChat } from "~/server/db/models/form";
import {
  type Grading,
  type ChoiceQuestion,
  type DateQuestion,
  type FileUploadQuestion,
  type Form as FormType,
  type Grid,
  type Image,
  type ImageItem,
  type Item,
  type Question,
  type QuestionGroupItem,
  type QuestionItem,
  type RowQuestion,
  type ScaleQuestion,
  type TextQuestion,
  type TimeQuestion,
  type VideoItem,
  Alignment,
} from "~/server/db/models/form.type";
import { createShortURL } from "~/server/db/models/shorturls";
import { formURLShortClicksType, formURLShortType, type formChatType } from "~/server/db/schema";
import { updateForm } from "~/server/gapi/form";

export function Form({
  formm,
  chatMessages,
  shortURLs,
  clicks,
}: {
  formm: FormType;
  chatMessages: formChatType[];
  shortURLs: formURLShortType[];
  clicks: formURLShortClicksType[];
}) {
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >(
    chatMessages.length
      ? chatMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.message,
      }))
      : [
        {
          role: "assistant",
          content:
            "Hi, I'm your AI Google Form assistant. How can I help you?",
        },
        {
          role: "user",
          content: "Create a form to collect name, email id., enrollment number of students and their course which can be AIML, AIDS or IIOT",
        },
        {
          role: "assistant",
          content: "Ok I'have created a form to collect student information, including name, email id., enrollment number of students and their course which can be AIML, AIDS or IIOT",
        },
        {
          role: "user",
          content: "edit the form to collect section name of student which can be A or B",
        },
        {
          role: "assistant",
          content: "Ok I have edited the form to collect section name of student which can be A or B",
        }
      ],
  );

  const [state, setState] = useState<"loading" | "idle">("idle");

  const [messageInput, setMessageInput] = useState("");

  const [form, setForm] = useState<FormType>(formm);

  return (
    <div className="flex h-full flex-col items-center gap-4 overflow-auto px-4">
      <div className="flex items-center justify-between w-full px-4">
        <h1 className="text-2xl font-bold">
          {!!form.info.title ? form.info.title : form.info.documentTitle}
        </h1>
        <ShortURLDialog form={form} shortURLs={shortURLs} clicks={clicks} />
      </div>
      <div className="grid h-full w-full grid-cols-2">
        <div className="flex flex-col gap-4 px-4">
          {state === "loading" ? (
            <>
              <div className="mb-4 flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
              </div>
              <div className="mb-4 flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
              </div>
              <div className="mb-4 flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
              </div>
            </>
          ) : (
            form.items?.map((item, index) => (
              <ItemRenderer key={index} item={item} />
            ))
          )}
        </div>
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>AI Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${message.role === "user" ? "justify-end" : "justify-start"} flex items-center gap-2`}
                >
                  {
                    message.role === "assistant" && <BotIcon className="size-5" />
                  }
                  <div
                    className={`inline-block rounded-lg p-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {state === "loading" && (
                <div className={`mb-4 text-left`}>
                  <Skeleton className="h-10 w-1/3" />
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full space-x-2">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button
                onClick={async () => {
                  const prompt = `
                  current form = ${JSON.stringify(form, null, 2)}
                  ${messageInput}
                  `;
                  setMessages((messages) => [
                    ...messages,
                    { role: "user", content: messageInput },
                  ]);
                  void updateFormChat({
                    formId: form.formId,
                    role: "user",
                    message: messageInput,
                  });
                  setMessageInput("");
                  setState("loading");
                  const res = await generateForm(
                    prompt,
                    messages.filter((m) => typeof m.content === "string") as {
                      role: "user" | "assistant";
                      content: string;
                    }[],
                  );
                  setMessages((messages) => [
                    ...messages.slice(0, -1),
                    {
                      role: "assistant",
                      content: res.message,
                    },
                  ]);
                  await updateFormChat({
                    formId: form.formId,
                    role: "assistant",
                    message: res.message,
                  });
                  if (res.request) {
                    const update = await updateForm(res.request, form.formId);
                    if (update.form) setForm(update.form);
                    else toast.error(update.error);
                  }
                  setState("idle");
                }}
                disabled={
                  messages.filter((m) => typeof m.content === "string")
                    .length === 1
                }
              >
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function ItemRenderer({ item }: { item: Item }) {
  if (!item) {
    return (
      <div className="mb-4 rounded-lg border p-4 shadow-sm">
        No item data available
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border p-4 shadow-sm">
      {item.title && (
        <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
      )}
      {item.description && (
        <p className="mb-2 text-gray-600">{item.description}</p>
      )}
      {item.questionItem && (
        <QuestionItemRenderer questionItem={item.questionItem} />
      )}
      {item.questionGroupItem && (
        <QuestionGroupItemRenderer questionGroupItem={item.questionGroupItem} />
      )}
      {item.pageBreakItem && <PageBreakItemRenderer />}
      {item.textItem && <TextItemRenderer />}
      {item.imageItem && <ImageItemRenderer imageItem={item.imageItem} />}
      {item.videoItem && <VideoItemRenderer videoItem={item.videoItem} />}
    </div>
  );
}

function QuestionItemRenderer({
  questionItem,
}: {
  questionItem: QuestionItem;
}) {
  return (
    <div className="mb-6">
      {questionItem.image && <ImageRenderer image={questionItem.image} />}
      <QuestionRenderer question={questionItem.question} />
    </div>
  );
}

function QuestionRenderer({ question }: { question: Question }) {
  return (
    <>
      {question.required && (
        <span className="mb-2 text-red-500">Required *</span>
      )}
      <div className="mb-4">
        {question.grading && <GradingRenderer grading={question.grading} />}
        {question.choiceQuestion && (
          <ChoiceQuestionRenderer choiceQuestion={question.choiceQuestion} />
        )}
        {question.textQuestion && (
          <TextQuestionRenderer textQuestion={question.textQuestion} />
        )}
        {question.scaleQuestion && (
          <ScaleQuestionRenderer scaleQuestion={question.scaleQuestion} />
        )}
        {question.dateQuestion && (
          <DateQuestionRenderer dateQuestion={question.dateQuestion} />
        )}
        {question.timeQuestion && (
          <TimeQuestionRenderer timeQuestion={question.timeQuestion} />
        )}
        {question.fileUploadQuestion && (
          <FileUploadQuestionRenderer
            fileUploadQuestion={question.fileUploadQuestion}
          />
        )}
        {question.rowQuestion && (
          <RowQuestionRenderer rowQuestion={question.rowQuestion} />
        )}
      </div>
    </>
  );
}

function ChoiceQuestionRenderer({
  choiceQuestion,
}: {
  choiceQuestion: ChoiceQuestion;
}) {
  return (
    <div>
      <p className="mb-2">Type: {choiceQuestion.type}</p>
      <ul className="list-disc pl-5">
        {choiceQuestion.options.map((option, index) => (
          <li key={index} className="mb-1">
            {option.value}
            {option.image && <ImageRenderer image={option.image} />}
            {option.isOther && (
              <span className="ml-2 text-gray-500">(Other)</span>
            )}
            {option.goToAction && (
              <span className="ml-2 text-blue-500">
                Go to: {option.goToAction}
              </span>
            )}
          </li>
        ))}
      </ul>
      {choiceQuestion.shuffle && (
        <p className="mt-2 text-sm text-gray-500">Options are shuffled</p>
      )}
    </div>
  );
}

function TextQuestionRenderer({
  textQuestion,
}: {
  textQuestion: TextQuestion;
}) {
  return (
    <div>
      <p>{textQuestion.paragraph ? "Paragraph" : "Short answer"} question</p>
    </div>
  );
}

function ScaleQuestionRenderer({
  scaleQuestion,
}: {
  scaleQuestion: ScaleQuestion;
}) {
  return (
    <div>
      <p className="mb-2">
        Scale from {scaleQuestion.low} to {scaleQuestion.high}
      </p>
      <div className="flex justify-between">
        {scaleQuestion.lowLabel && (
          <span className="text-sm">{scaleQuestion.lowLabel}</span>
        )}
        {scaleQuestion.highLabel && (
          <span className="text-sm">{scaleQuestion.highLabel}</span>
        )}
      </div>
    </div>
  );
}

function DateQuestionRenderer({
  dateQuestion,
}: {
  dateQuestion: DateQuestion;
}) {
  return (
    <div>
      <p>Date question</p>
      {dateQuestion.includeTime && (
        <span className="ml-2 text-sm">Includes time</span>
      )}
      {dateQuestion.includeYear && (
        <span className="ml-2 text-sm">Includes year</span>
      )}
    </div>
  );
}

function TimeQuestionRenderer({
  timeQuestion,
}: {
  timeQuestion: TimeQuestion;
}) {
  return (
    <div>
      <p>Time question</p>
      {timeQuestion.duration && <span className="ml-2 text-sm">Duration</span>}
    </div>
  );
}

function FileUploadQuestionRenderer({
  fileUploadQuestion,
}: {
  fileUploadQuestion: FileUploadQuestion;
}) {
  return (
    <div>
      <p className="mb-2">File upload question</p>
      {fileUploadQuestion.types && (
        <p className="text-sm">
          Allowed types: {fileUploadQuestion.types.join(", ")}
        </p>
      )}
      {fileUploadQuestion.maxFiles && (
        <p className="text-sm">Max files: {fileUploadQuestion.maxFiles}</p>
      )}
      {fileUploadQuestion.maxFileSize && (
        <p className="text-sm">
          Max file size: {fileUploadQuestion.maxFileSize}
        </p>
      )}
    </div>
  );
}

function RowQuestionRenderer({ rowQuestion }: { rowQuestion: RowQuestion }) {
  return (
    <div>
      <p>Row question: {rowQuestion.title}</p>
    </div>
  );
}

function QuestionGroupItemRenderer({
  questionGroupItem,
}: {
  questionGroupItem: QuestionGroupItem;
}) {
  return (
    <div className="mb-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-semibold">Question Group</h3>
      {questionGroupItem.questions.map((question, index) => (
        <QuestionRenderer key={index} question={question} />
      ))}
      {questionGroupItem.image && (
        <ImageRenderer image={questionGroupItem.image} />
      )}
      {questionGroupItem.grid && <GridRenderer grid={questionGroupItem.grid} />}
    </div>
  );
}

function GridRenderer({ grid }: { grid: Grid }) {
  return (
    <div className="mt-4">
      <h4 className="text-md mb-2 font-semibold">Grid</h4>
      <ChoiceQuestionRenderer choiceQuestion={grid.columns} />
      {grid.shuffleQuestions && (
        <p className="mt-2 text-sm">Questions are shuffled</p>
      )}
    </div>
  );
}

function PageBreakItemRenderer() {
  return <hr className="my-6 border-t-2 border-gray-300" />;
}

function TextItemRenderer() {
  return <p className="mb-4">Text item (content not specified in type)</p>;
}

function ImageItemRenderer({ imageItem }: { imageItem: ImageItem }) {
  return <ImageRenderer image={imageItem.image} />;
}

function ImageRenderer({ image }: { image: Image }) {
  return (
    <div className="mb-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          image.contentUri ??
          image.sourceUri ??
          "/placeholder.svg?height=300&width=400"
        }
        alt={image.altText ?? "Form image"}
        className="h-auto max-w-full rounded"
        style={{
          width: image.properties?.width
            ? `${image.properties.width}px`
            : "auto",
          display: "block",
          marginLeft:
            image.properties?.alignment === Alignment.CENTER
              ? "auto"
              : undefined,
          marginRight:
            image.properties?.alignment === Alignment.CENTER
              ? "auto"
              : undefined,
          float:
            image.properties?.alignment === Alignment.LEFT
              ? "left"
              : image.properties?.alignment === Alignment.RIGHT
                ? "right"
                : undefined,
        }}
      />
      {image.altText && (
        <p className="mt-1 text-sm text-gray-500">{image.altText}</p>
      )}
    </div>
  );
}

function VideoItemRenderer({ videoItem }: { videoItem: VideoItem }) {
  return (
    <div className="mb-4">
      <iframe
        width="560"
        height="315"
        src={videoItem.video.youtubeUri}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded"
      ></iframe>
      {videoItem.caption && (
        <p className="mt-1 text-sm text-gray-500">{videoItem.caption}</p>
      )}
    </div>
  );
}

function GradingRenderer({ grading }: { grading: Grading }) {
  return (
    <div className="mt-2 text-sm text-gray-600">
      <p>Point value: {grading.pointValue}</p>
      {grading.correctAnswers && (
        <p>
          Correct answers:{" "}
          {grading.correctAnswers.answers.map((a) => a.value).join(", ")}
        </p>
      )}
    </div>
  );
}

function ShortURLDialog({ form, shortURLs, clicks }: { form: FormType, shortURLs: formURLShortType[], clicks: formURLShortClicksType[] }) {
  const [customURL, setCustomURL] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LinkIcon className="mr-2 h-4 w-4" />
          Manage Short URLs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Short URLs</DialogTitle>

          <DialogDescription>
            Manage and track shortened URLs for this form
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Custom short URL (optional)"
            onChange={(e) => setCustomURL(e.target.value)}
            value={customURL}
          />
          <Button
            size="sm"
            onClick={() => {
              if (!form.responderUri) {
                toast.error("Form does not have a responder URI");
                return;
              }
              void createShortURL({
                formId: form.formId,
                shortURL: customURL,
                responderURI: form.responderUri
              });
              setCustomURL("");
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New URL
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {shortURLs.map((url) => (
            <AccordionItem key={url.id} value={url.id}>
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-4">
                  <span>{url.shortURL}</span>
                  <Badge variant="secondary">
                    {clicks.filter((c) => c.formURLShortId === url.id).length} clicks
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/f/${url.shortURL}`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void navigator.clipboard.writeText(
                          `${window.location.origin}/f/${url.shortURL}`
                        );
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
