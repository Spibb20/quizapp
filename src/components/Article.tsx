"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentIcon, Star } from "./icons/icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type ArticleResponse = {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
};

export function Article() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function addArticle() {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      setError("Please add both a title and article content.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const summaryResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleanContent }),
      });

      const summaryData = await summaryResponse.json();

      if (!summaryResponse.ok) {
        throw new Error(summaryData?.error || "Failed to summarize article.");
      }

      const articleResponse = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
          summary: summaryData.summary || "",
        }),
      });

      const article = (await articleResponse.json()) as ArticleResponse & {
        error?: string;
      };

      if (!articleResponse.ok) {
        throw new Error(article?.error || "Failed to save article.");
      }

      window.dispatchEvent(
        new CustomEvent("article-created", {
          detail: article,
        })
      );

      setTitle("");
      setContent("");
      router.push(`/quiz/${article.id}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex w-full max-w-4xl flex-col gap-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Star />
        <h1 className="text-2xl font-bold">Article Quiz Generator</h1>
      </div>

      <p className="text-gray-500">
        Paste your article below to generate a short summary and a quiz. Saved
        articles will appear in the sidebar history.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <DocumentIcon />
        <p className="text-gray-500">Article Title</p>
      </div>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for your article..."
        disabled={isLoading}
      />

      <div className="flex items-center gap-3 pt-2">
        <DocumentIcon />
        <p className="text-gray-500">Article Content</p>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your article content here..."
        className="min-h-36"
        disabled={isLoading}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        className="ml-auto w-full max-w-xs"
        onClick={addArticle}
        disabled={isLoading || !title.trim() || !content.trim()}
      >
        {isLoading ? "Generating..." : "Generate summary"}
      </Button>
    </section>
  );
}
