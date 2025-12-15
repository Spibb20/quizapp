import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function toId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function toScore(value: unknown) {
  const score = Number(value);
  return Number.isInteger(score) && score >= 0 ? score : null;
}

export async function POST(req: Request) {
  try {
    const { article_id, score } = await req.json();
    const articleId = toId(article_id);
    const quizScore = toScore(score);

    if (!articleId || quizScore === null) {
      return NextResponse.json(
        { error: "Valid article_id and score are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.score.create({
      data: {
        article_id: articleId,
        score: quizScore,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST /api/score failed:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await prisma.score.findMany({
      orderBy: { id: "desc" },
      include: {
        article: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/score failed:", error);
    return NextResponse.json({ error: "Failed to load scores" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, score } = await req.json();
    const scoreId = toId(id);
    const quizScore = toScore(score);

    if (!scoreId || quizScore === null) {
      return NextResponse.json(
        { error: "Valid id and score are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.score.update({
      where: { id: scoreId },
      data: { score: quizScore },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/score failed:", error);
    return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const scoreId = toId(id);

    if (!scoreId) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    const deleted = await prisma.score.delete({
      where: { id: scoreId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("DELETE /api/score failed:", error);
    return NextResponse.json({ error: "Failed to delete score" }, { status: 500 });
  }
}
