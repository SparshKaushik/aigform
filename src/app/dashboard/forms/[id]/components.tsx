"use client";

import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import type {
  ChoiceQuestion,
  DateQuestion,
  FileUploadQuestion,
  Form as FormType,
  ImageItem,
  Item,
  Question,
  QuestionGroupItem,
  QuestionItem,
  RowQuestion,
  ScaleQuestion,
  TextQuestion,
  TimeQuestion,
  VideoItem,
} from "~/server/db/models/form.type";

export function Form({ formm }: { formm: FormType }) {
  const [messages, setMessages] = useState<
    {
      role: "user" | "bot";
      content: string | JSX.Element;
    }[]
  >([]);

  const [messageInput, setMessageInput] = useState("");

  const [form, setForm] = useState<FormType>(formm);

  return (
    <div className="flex h-full flex-col items-center gap-4 px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {!!form.info.title ? form.info.title : form.info.documentTitle}
        </h1>
      </div>
      <div className="grid h-full w-full grid-cols-2">
        <div className="flex flex-col gap-4">
          {form.items?.map((item, index) => (
            <ItemRenderer key={index} item={item} />
          ))}
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
                  className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block rounded-lg p-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
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
                onClick={() => {
                  setMessages((messages) => [
                    ...messages,
                    { role: "user", content: messageInput },
                  ]);
                  setMessageInput("");
                  setMessages((messages) => [
                    ...messages,
                    {
                      role: "bot",
                      content: <Loader2Icon className="size-5 animate-spin" />,
                    },
                  ]);
                }}
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
  if (item.questionItem)
    return <QuestionItemRenderer questionItem={item.questionItem} />;
  if (item.questionGroupItem)
    return (
      <QuestionGroupItemRenderer questionGroupItem={item.questionGroupItem} />
    );
  if (item.pageBreakItem) return <PageBreakItemRenderer />;
  if (item.textItem) return <TextItemRenderer />;
  if (item.imageItem) return <ImageItemRenderer imageItem={item.imageItem} />;
  if (item.videoItem) return <VideoItemRenderer videoItem={item.videoItem} />;
  return null;
}

function QuestionItemRenderer({
  questionItem,
}: {
  questionItem: QuestionItem;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-xl font-semibold">
        {questionItem.question.questionId}
      </h3>
      <QuestionRenderer question={questionItem.question} />
      {questionItem.image && <ImageRenderer image={questionItem.image} />}
    </div>
  );
}

function QuestionRenderer({ question }: { question: Question }) {
  if (question.choiceQuestion)
    return <ChoiceQuestionRenderer choiceQuestion={question.choiceQuestion} />;
  if (question.textQuestion)
    return <TextQuestionRenderer textQuestion={question.textQuestion} />;
  if (question.scaleQuestion)
    return <ScaleQuestionRenderer scaleQuestion={question.scaleQuestion} />;
  if (question.dateQuestion)
    return <DateQuestionRenderer dateQuestion={question.dateQuestion} />;
  if (question.timeQuestion)
    return <TimeQuestionRenderer timeQuestion={question.timeQuestion} />;
  if (question.fileUploadQuestion)
    return (
      <FileUploadQuestionRenderer
        fileUploadQuestion={question.fileUploadQuestion}
      />
    );
  if (question.rowQuestion)
    return <RowQuestionRenderer rowQuestion={question.rowQuestion} />;
  return null;
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
          <li key={index}>{option.value}</li>
        ))}
      </ul>
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
      <p>
        Scale from {scaleQuestion.low} to {scaleQuestion.high}
      </p>
      {scaleQuestion.lowLabel && <span>Low: {scaleQuestion.lowLabel}</span>}
      {scaleQuestion.highLabel && <span>High: {scaleQuestion.highLabel}</span>}
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
      {dateQuestion.includeTime && <span>Includes time</span>}
      {dateQuestion.includeYear && <span>Includes year</span>}
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
      {timeQuestion.duration && <span>Duration</span>}
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
      <p>File upload question</p>
      <p>Folder ID: {fileUploadQuestion.folderId}</p>
      {fileUploadQuestion.types && (
        <p>Allowed types: {fileUploadQuestion.types.join(", ")}</p>
      )}
      {fileUploadQuestion.maxFiles && (
        <p>Max files: {fileUploadQuestion.maxFiles}</p>
      )}
      {fileUploadQuestion.maxFileSize && (
        <p>Max file size: {fileUploadQuestion.maxFileSize}</p>
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
    <div className="mb-4 border p-4">
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

function GridRenderer({ grid }: { grid: QuestionGroupItem["grid"] }) {
  return (
    <div>
      <h4 className="text-md font-semibold">Grid</h4>
      {grid && <ChoiceQuestionRenderer choiceQuestion={grid.columns} />}
      {grid?.shuffleQuestions && <p>Questions are shuffled</p>}
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

function ImageRenderer({ image }: { image: ImageItem["image"] }) {
  return (
    <div className="mb-4">
      <img
        src={
          image.contentUri ?? image.sourceUri ?? "http://placehold.co/400/300"
        }
        alt={image.altText ?? "Form image"}
        className="h-auto max-w-full"
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
      ></iframe>
      {videoItem.caption && (
        <p className="mt-1 text-sm text-gray-500">{videoItem.caption}</p>
      )}
    </div>
  );
}
