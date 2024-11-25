"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "~/env";
import { generateText } from "ai";
import { type z } from "zod";
import { type BatchUpdateAIResponseSchema } from "./db/models/form.zod";

const ai = createGoogleGenerativeAI({
  apiKey: env.GROQ_API_KEY,
});

const gemma2 = ai("gemini-1.5-flash-latest", {
  structuredOutputs: true,
});

export async function generateForm(
  prompt: string,
  messages: {
    role: "user" | "assistant";
    content: string;
  }[],
) {
  const res = await generateText({
    model: gemma2,
    prompt: prompt,
    system: `type ChoiceType="CHOICE_TYPE_UNSPECIFIED"|"RADIO"|"CHECKBOX"|"DROP_DOWN"
type GoToAction="GO_TO_ACTION_UNSPECIFIED"|"NEXT_SECTION"|"RESTART_FORM"|"SUBMIT_FORM"
type Alignment="ALIGNMENT_UNSPECIFIED"|"LEFT"|"RIGHT"|"CENTER"
type FileType="FILE_TYPE_UNSPECIFIED"|"ANY"|"DOCUMENT"|"PRESENTATION"|"SPREADSHEET"|"DRAWING"|"PDF"|"IMAGE"|"VIDEO"|"AUDIO"

interface Image{contentUri?:string;altText?:string;properties?:{alignment?:Alignment;width?:number};sourceUri?:string}
interface Video{youtubeUri:string;properties?:{alignment?:Alignment;width?:number}}
interface Option{value:string;image?:Image;isOther?:boolean;goToAction?:GoToAction;goToSectionId?:string}
interface Question{
required?:boolean
grading?:{
pointValue:number
correctAnswers:{answers:{value:string}[]}
whenRight?:any
whenWrong?:any
generalFeedback?:any
}
choiceQuestion?:{type:ChoiceType;options:Option[];shuffle?:boolean}
textQuestion?:{paragraph?:boolean}
scaleQuestion?:{low:number;high:number;lowLabel?:string;highLabel?:string}
dateQuestion?:{includeTime?:boolean;includeYear?:boolean}
timeQuestion?:{duration?:boolean}
fileUploadQuestion?:{folderId:string;types?:FileType[];maxFiles?:number;maxFileSize?:string}
rowQuestion?:{title:string}
}
interface Item{
title?:string
description?:string
questionItem?:{question:Question;image?:Image}
questionGroupItem?:{
questions:Question[]
image?:Image
grid?:{columns:{type:ChoiceType;options:Option[];shuffle?:boolean};shuffleQuestions?:boolean}
}
pageBreakItem?:{}
textItem?:{}
imageItem?:{image:Image}
videoItem?:{video:Video;caption?:string}
}
interface BatchUpdateRequest{
updateFormInfo?:{info:{title?:string;description?:string};updateMask:"*"}
updateSettings?:{settings:{quizSettings?:{isQuiz:boolean}};updateMask:"*"}
createItem?:{item:Item;location:{index:number}}
moveItem?:{originalLocation:{index:number};newLocation:{index:number}}
deleteItem?:{location:{index:number}}
updateItem?:{item:Item;location:{index:number};updateMask:string}
}
export interface BatchUpdateFormRequest{
requests:BatchUpdateRequest[]
writeControl?:{requiredRevisionId?:string;targetRevisionId?:string}
}
export interface BatchUpdateAIResponse{
request?:BatchUpdateFormRequest
message:string
}

The location index of an item in the form must be in the range [0..N), where N is the number of items in the form and should not overlap with existing questions. if you wish to add questions in place of existing then add a move request to move the existing item to the desired place and create new items in their place. all the location indexes should be according to the given current form. Choose a form name accordingly.

You are a google form creator AI assistant and edits the form according to the user's instructions. if not possible the send only message.
you only respond with json objects of type BatchUpdateAIResponse `,
    // messages,
  });
  return JSON.parse(
    res.text.replace("```json", "").replace("```", ""),
  ) as z.infer<typeof BatchUpdateAIResponseSchema>;
}

export async function generateFormAnalysis(
  prompt: string,
) {
  const res = await generateText({
    model: gemma2,
    prompt,
    system: `You are a google form creator AI assistant and analyzes the responses of a form. Give the analysis in markdown format. Give a simple analysis unless specified.`,
  });
  return res.text;
}
