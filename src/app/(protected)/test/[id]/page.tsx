"use client";

import {
  CloseIcon,
  Correct,
  InCorrect,
  RestartIcon,
  SaveIcon,
  Star,
} from "@/components/icons/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { SpinnerItem } from "@/components/Loading/LoadingQuiz";

type QuizAnswer = {
  answer: string;
  correct: boolean;
};

type QuizQuestion = {
  question: string;
  answers: QuizAnswer[];
};

export default function QuizText({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function createQuiz() {
      try {
        setLoading(true);
        setError("");

        const articleResponse = await fetch(`/api/articles?id=${id}`);
        const articleData = await articleResponse.json();

        if (!articleResponse.ok) {
          throw new Error(articleData?.error || "Article not found.");
        }

        const quizResponse = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ article: articleData.content }),
        });
        const quizData = await quizResponse.json();

        if (!quizResponse.ok) {
          throw new Error(quizData?.error || "Failed to generate quiz.");
        }

        setQuiz(quizData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    createQuiz();
  }, [id]);

  async function saveScore(finalScore: number) {
    try {
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: id,
          score: finalScore,
        }),
      });
    } catch (err) {
      console.error("Score save failed:", err);
    }
  }

  function pick(answer: QuizAnswer) {
    const nextAnswers = [...userAnswers, answer];
    setUserAnswers(nextAnswers);

    if (current < quiz.length - 1) {
      setCurrent((value) => value + 1);
      return;
    }

    const finalScore = nextAnswers.filter((item) => item.correct).length;
    setScore(finalScore);
    setFinished(true);
    saveScore(finalScore);
  }

  if (loading) return <SpinnerItem />;

  if (error || quiz.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 p-10">
        <h1 className="text-2xl font-bold">Quiz could not be loaded</h1>
        <p className="text-gray-500">{error || "No quiz questions were generated."}</p>
        <Link href="/">
          <Button>Go home</Button>
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 p-10">
        <div className="flex items-center gap-3">
          <Star />
          <h1 className="text-2xl font-bold">Quiz completed</h1>
        </div>

        <p className="text-gray-500">Let’s see what you did</p>

        <div className="text-2xl font-bold">
          Your score: {score} / {quiz.length}
        </div>

        <div className="w-full max-w-2xl space-y-6 rounded-xl border p-5">
          {quiz.map((questionItem, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = questionItem.answers.find((a) => a.correct);
            const isCorrect = Boolean(userAnswer?.correct);

            return (
              <div key={index} className="flex flex-col gap-1 border-b pb-3 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{isCorrect ? <Correct /> : <InCorrect />}</div>
                  <div className="flex flex-col">
                    <p className="text-gray-500">
                      {index + 1}. {questionItem.question}
                    </p>
                    <p className={isCorrect ? "text-green-600" : "text-red-500"}>
                      Your answer: {userAnswer?.answer}
                    </p>
                  </div>
                </div>

                {!isCorrect && correctAnswer ? (
                  <p className="pl-9 text-green-600">Correct: {correctAnswer.answer}</p>
                ) : null}
              </div>
            );
          })}

          <div className="flex flex-wrap justify-between gap-3 px-2 sm:px-10">
            <Button
              onClick={() => window.location.reload()}
              className="flex h-10 w-44 items-center gap-3 rounded-2xl border bg-white text-black"
            >
              <RestartIcon />
              Restart quiz
            </Button>
            <Link href="/">
              <Button className="flex h-10 w-44 items-center gap-3 rounded-2xl border">
                <SaveIcon />
                Save and leave
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz[current];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Star />
          <h1 className="text-2xl font-bold">Quick Test</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10 w-12 rounded-2xl bg-gray-300">
              <CloseIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Are you sure?</DialogTitle>
              <DialogDescription className="text-red-500">
                If you cancel, this quiz result will not be saved.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-[190px] rounded-2xl bg-black text-white"
              >
                Restart
              </Button>
              <Link href="/">
                <Button className="w-[190px] rounded-2xl border border-gray-500 bg-white text-black">
                  Cancel quiz
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className="flex w-full max-w-xl flex-col items-center justify-center gap-5 rounded-2xl border p-6">
        <div className="flex w-full items-center justify-between gap-3">
          <h2 className="font-bold">{question.question}</h2>
          <div className="flex">
            <span className="font-bold">{current + 1}</span>
            <span className="text-gray-500">/{quiz.length}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {question.answers.map((answer, i) => (
            <Button key={i} className="min-h-11 font-bold" onClick={() => pick(answer)}>
              {answer.answer}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
