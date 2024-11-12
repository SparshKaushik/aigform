"use client";

import { BotIcon, Loader2, SendIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type FormResponse } from "~/server/gapi/form";
import { type Form } from "~/server/db/models/form.type";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { generateFormAnalysis } from "~/server/ai";
import { marked } from "marked";
import { Skeleton } from "~/components/ui/skeleton";

export function Form({ responses, form }: { responses: FormResponse[]; form: Form }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; }[]>([
    { role: "assistant", content: "Hi, I'm your AI assistant. How can I help you analyze these responses?" }
  ]);
  const [messageInput, setMessageInput] = useState("");

  const [state, setState] = useState<"idle" | "loading">("idle");

  return (
    <div className="flex h-full flex-col items-center gap-2 overflow-auto px-6 py-2">
      <h1 className="text-2xl font-bold mb-6">{form.info.title ?? form.info.documentTitle}</h1>
      <div className="grid h-full w-full gap-6 lg:grid-cols-2">
        {/* Left side - Responses */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {responses.map((response) => (
                <Card key={response.responseId} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                          <p className="font-medium">{response.respondentEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(response.lastSubmittedTime).toLocaleString()}
                          </p>
                      </div>
                      {response.totalScore !== undefined && (
                        <Badge variant="secondary" className="text-lg">
                          Score: {response.totalScore}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      {Object.values(response.answers ?? {}).map((answer) => (
                        <div key={answer.questionId} className="border-t pt-2">
                          <p className="font-medium">
                            {form.items?.find((item) => item.questionItem?.question.questionId === answer.questionId)?.title}
                          </p>
                          {answer.textAnswers?.answers?.map((textAnswer, i) => (
                            <p key={i} className="text-sm text-muted-foreground mt-1">
                              {textAnswer.value}
                            </p>
                          ))}
                          {answer.fileUploadAnswers?.answers?.map((fileAnswer, i) => (
                            <p key={i} className="text-sm text-blue-600 hover:underline mt-1">
                              <a href={fileAnswer.fileId} target="_blank" rel="noopener noreferrer">
                                📎 {fileAnswer.fileName}
                              </a>
                            </p>
                          ))}
                          {answer.grade && (
                            <div className="mt-2 p-2 bg-muted rounded-md">
                              <p className="text-sm font-medium">Score: {answer.grade.score}</p>
                              {answer.grade.feedback && (
                                <p className="text-sm text-muted-foreground mt-1">Feedback: {answer.grade.feedback.text}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right side - Chat */}
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>AI Analysis Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        <BotIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: marked(message.content) }} />
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setMessages((prev) => [...prev, { role: "user", content: messageInput }]);
                setMessageInput("");
                setState("loading");
                generateFormAnalysis(`
                  Full Form info: ${JSON.stringify(form)}
                  Responses: ${JSON.stringify(responses)}
                  ${messageInput}`).then((res) => {
                  setMessages((prev) => [...prev, { role: "assistant", content: res }]);
                  setState("idle");
                });
              }}
              className="flex w-full space-x-2"
            >
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button type="submit" disabled={state === "loading"}>
                {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
