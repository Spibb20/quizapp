"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  X,
  ChevronDown,
  ChevronUp,
  Ghost,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  quizzes: Quiz[];
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullContent, setShowFullContent] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
        setUserAnswers(new Array(data.article.quizzes?.length || 0).fill(-1));
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers(new Array(article?.quizzes?.length || 0).fill(-1));
    setQuizFinished(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!quizFinished) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setUserAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (article?.quizzes?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    if (!article) return;

    let correctCount = 0;
    article.quizzes.forEach((quiz, index) => {
      if (userAnswers[index] === parseInt(quiz.answer)) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizFinished(true);

    saveQuizAttempt(correctCount);
  };

  const saveQuizAttempt = async (correctCount: number) => {
    try {
      await fetch(`/api/articles/$${params.id}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: userAnswers.reduce((acc, answer, index) => {
            acc[article!.quizzes[index].id] = answer;
            return acc;
          }, {} as Record<string, number>),
          score: correctCount,
        }),
      });
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setUserAnswers(new Array(article?.quizzes?.length || 0).fill(-1));
    setScore(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {" "}
        <Loader2 className="h-8 w-8 animate-spin"></Loader2>{" "}
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <Card className="p-6 mt-4">
          <p className="text-center text-muted-foreground">Article not found</p>
        </Card>
      </div>
    );
  }

  const currentQuiz = article.quizzes[currentQuestion];
  const contentPreview = showFullContent
    ? article.content
    : article.content.slice(0, 500) +
      (article.content.length > 500 ? "..." : "");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to History
      </Button>

      {!quizStarted ? (
        <Card className="p-6 mt-4">
          <h1 className="text-2xl font-bold mb-4">{article.title} </h1>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-lg">Summary</h2>
            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
              {" "}
              {article.summary}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg">Full Content</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
                className="gap-1"
              >
                {showFullContent ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{contentPreview}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" onClick={startQuiz} className="px-8">
              Take Quiz ({article.quizzes.length} questions)
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 mt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Quiz: {article.title}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {article.quizzes.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetQuiz}
              title="Restart Quiz"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!quizFinished ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {currentQuiz.question}
                </h2>
                <div className="space-y-3">
                  {currentQuiz.options.map((option, index) => {
                    const isSelected = userAnswers[currentQuestion] === index;
                    const isAnswerSubmitted =
                      userAnswers[currentQuestion] !== -1;

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={cn(
                          "w-full justify-start p-4 h-auto text-left",
                          isSelected && "border-primary bg-primary/5",
                          isAnswerSubmitted &&
                            index === parseInt(currentQuiz.answer) &&
                            "border-green-500 bg-green-50"
                        )}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isAnswerSubmitted}
                      >
                        <div className="flex items-center w-full">
                          <div
                            className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full mr-3",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "border"
                            )}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isAnswerSubmitted &&
                            index === parseInt(currentQuiz.answer) && (
                              <Badge variant="default" className="ml-2">
                                Correct
                              </Badge>
                            )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {userAnswers.map((answer, index) => (
                    <Button
                      key={index}
                      variant={
                        currentQuestion === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentQuestion(index)}
                      className="w-8 h-8 p-8"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={userAnswers[currentQuestion] === -1}
                >
                  {currentQuestion === article.quizzes.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                </Button>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </Card>
      )}
    </div>
  );
}
