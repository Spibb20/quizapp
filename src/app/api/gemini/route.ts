import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type GeminiAnswer = {
  answer: string;
  correct: boolean;
};

type GeminiQuestion = {
  question: string;
  answers: GeminiAnswer[];
};

function parseQuiz(text: string): GeminiQuestion[] {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  const raw = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (Array.isArray(item.answers)) {
        return {
          question: String(item.question || ""),
          answers: item.answers.map((answer: GeminiAnswer) => ({
            answer: String(answer.answer || ""),
            correct: Boolean(answer.correct),
          })),
        };
      }

      if (Array.isArray(item.options)) {
        const correctIndex = Number(item.answer);
        return {
          question: String(item.question || ""),
          answers: item.options.map((option: string, index: number) => ({
            answer: String(option || ""),
            correct: index === correctIndex,
          })),
        };
      }

      return null;
    })
    .filter((item): item is GeminiQuestion => {
      if (!item) return false;

      const candidate = item as GeminiQuestion;
      return Boolean(
        candidate.question &&
          candidate.answers.length === 4 &&
          candidate.answers.filter((answer: GeminiAnswer) => answer.correct).length === 1
      );
    })
    .slice(0, 5);
}

export async function POST(req: Request) {
  try {
    const { article } = await req.json();

    if (!article?.trim()) {
      return NextResponse.json(
        { error: "Article content is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      vertexai: false,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `Generate exactly 5 multiple-choice quiz questions from this article.
Return only raw JSON. Do not use markdown or code fences.
Each question must have exactly 4 short answers. Exactly one answer must be correct.
Use this shape:
[
  {
    "question": "string",
    "answers": [
      { "answer": "string", "correct": true },
      { "answer": "string", "correct": false },
      { "answer": "string", "correct": false },
      { "answer": "string", "correct": false }
    ]
  }
]
Article:
${article}`,
        },
      ],
    });

    const text = result.text || "[]";
    const quiz = parseQuiz(text);

    if (quiz.length === 0) {
      return NextResponse.json(
        { error: "Gemini returned an invalid quiz format" },
        { status: 502 }
      );
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("POST /api/gemini failed:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
