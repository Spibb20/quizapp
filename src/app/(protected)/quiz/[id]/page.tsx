"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BackIcon, Bookicon, DocumentIcon, Star } from "@/components/icons/icons";
import { SpinnerItem } from "@/components/Loading/LoadingQuiz";

type ArticleDetail = {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
};

export default function Quiz({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadArticle() {
      try {
        setError("");
        const res = await fetch(`/api/articles?id=${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Article not found.");
        }

        setArticle(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  if (loading) return <SpinnerItem />;

  if (error || !article) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 p-10">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="text-gray-500">{error || "This article does not exist."}</p>
        <Button onClick={() => router.push("/")}>Go home</Button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-6">
      <section className="flex min-h-[500px] w-full max-w-3xl flex-col justify-center gap-4 rounded-2xl border p-8 shadow-sm">
        <Button
          className="w-[50px] border bg-white text-black"
          onClick={() => router.push("/")}
        >
          <BackIcon />
        </Button>

        <div className="flex items-center gap-3">
          <Star />
          <h1 className="text-2xl font-bold">Article Quiz Generator</h1>
        </div>

        <div className="flex items-center gap-3">
          <Bookicon />
          <h2 className="font-bold text-gray-500">Summarized content</h2>
        </div>

        <p className="text-md">{article.summary || "No summary saved."}</p>

        <div className="mt-2 flex items-center gap-3">
          <DocumentIcon />
          <p className="text-gray-400">Article Content</p>
        </div>

        <p className="line-clamp-3 text-sm text-gray-700">
          {article.content || "No content saved."}
        </p>

        <div className="flex justify-between gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">See more</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-4 text-2xl font-bold">
                  {article.title}
                </DialogTitle>
                <DialogDescription className="max-h-[60vh] overflow-auto whitespace-pre-wrap text-left">
                  {article.content}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button className="w-40" onClick={() => router.push(`/test/${id}`)}>
            Take a quiz
          </Button>
        </div>
      </section>
    </div>
  );
}
