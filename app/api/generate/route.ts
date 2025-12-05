import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { error } from "console";

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
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthrzd" }, { status: 401 });
    }
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const summaryResponse = await ai.models.generateContent({
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
    const summary = summaryResponse.text;
    console.log(summary);

    const quizResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Generate 5 multiple choice questions based on this article: ${content}. Return the response in this exact JSON format:[
      {
      "question":"Question text here",
      "options": ["Option 1", "Option 2", "Option 3", Option 4],
      "answer": "0"
      }]
      Make sure the response is valid JSON and the answer is the index (0-3) of the correct option`,
    });

    let quizQuestions;
    try {
      const quizText = quizResponse.text;
      const jsonMatch = quizText?.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        quizQuestions = JSON.parse(jsonMatch[0]);
        quizQuestions = quizQuestions.map((q: any) => ({
          ...q,
          answer: parseInt(q.answer),
        }));
        console.log(quizQuestions);
      } else {
        throw new Error("No JSON");
      }
    } catch (error) {
      console.error("Failed to parse quiz JSON:", error);
      quizQuestions = [];
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`.trim(),
        },
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        userId: dbUser.id,
        quizzes: {
          create: quizQuestions.map((q: any) => ({
            question: q.question,
            options: q.options,
            answer: q.answer.toString(),
          })),
        },
      },
      include: {
        quizzes: true,
      },
    });

    return NextResponse.json(
      {
        message: "Content summarized",
        summary,
        quiz: quizQuestions,
        articleId: article.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in generate API: ", error);
    return NextResponse.json({ error: "Erver error" }, { status: 500 });
  }
};
