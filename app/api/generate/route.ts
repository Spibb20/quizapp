import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*export const POST = async (req: NextRequest) => {
  const text = await req.json();

  console.log(text);
  return NextResponse.json(
    { message: "Content summarized", data: text },
    { status: 201 }
  );
};*/

export const POST = async (req: NextRequest) => {
  const { title, content } = await req.json();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `Please provide a concise summary of the following article: 
    Title: ${title}
    Content: ${content}  
     The summary should:
    - Focus on the article's core message and main points.
    - Flow naturally as a paragraph, not as a list or outline.
    - Contain enough meaningful details to allow relevant questions to be generated from it later.
    - Maximum length: 60 words
     
     Summary:`,
  });
  const summary = response.text;

  return NextResponse.json(
    {
      message: "Content summarized",
      summary: summary,
    },
    { status: 200 }
  );
};
