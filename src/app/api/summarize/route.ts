import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ summary: "" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `Summarize this article in 3-5 concise sentences. Keep the core facts and context clear:\n\n${content}`,
        },
      ],
    });

    return NextResponse.json({ summary: result.text ?? "" });
  } catch (error) {
    console.error("POST /api/summarize failed:", error);
    return NextResponse.json(
      { error: "Failed to summarize article" },
      { status: 500 }
    );
  }
}
