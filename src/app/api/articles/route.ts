import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function toId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const id = toId(url.searchParams.get("id"));

    if (id) {
      const article = await prisma.article.findUnique({
        where: { id },
        include: { quiz: true },
      });

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      return NextResponse.json(article);
    }

    const articles = await prisma.article.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/articles failed:", error);
    return NextResponse.json(
      { error: "Failed to load articles" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { title, summary, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        summary: summary?.trim() || "",
        content: content.trim(),
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles failed:", error);
    return NextResponse.json(
      { error: "Failed to save article" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { id } = await req.json();
    const articleId = toId(id);

    if (!articleId) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    const articles = await prisma.article.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("DELETE /api/articles failed:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { id, title, summary, content } = await req.json();
    const articleId = toId(id);

    if (!articleId) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    const data: { title?: string; summary?: string; content?: string } = {};

    if (typeof title === "string") data.title = title.trim();
    if (typeof summary === "string") data.summary = summary.trim();
    if (typeof content === "string") data.content = content.trim();

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    await prisma.article.update({
      where: { id: articleId },
      data,
    });

    const articles = await prisma.article.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("PATCH /api/articles failed:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
};
