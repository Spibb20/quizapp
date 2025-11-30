"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert } from "@/components/ui/alert";

export function ArticleSummarizer() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to your AI service
      const response = await fetch("/api/summarize-and-quiz", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      setSummary(data.summary);
      setQuizQuestions(data.quiz);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="mb-6">Article Summarizer & Quiz Generator</h1>

        <div className=" gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="mb-4">Input Article</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Article Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your article content here..."
                    className="min-h-[200px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !content.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Summary & Quiz"
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="p-4">
              <h3 className="mb-3">AI Summary</h3>
              <ScrollArea className="h-[200px]">
                {summary ? (
                  <p className="whitespace-pre-wrap">{summary}</p>
                ) : (
                  <p className="text-muted-foreground">
                    Summary will appear here after generation...
                  </p>
                )}
              </ScrollArea>
            </Card>

            {/* Quiz Card */}
            <Card className="p-4">
              <h3 className="mb-3">Quick Test</h3>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  <div className="pb-4 border-b last:border-b-0">
                    <p className="font-medium mb-3"></p>
                    <RadioGroup>
                      <div className="flex items-center space-x-2 mb-2">
                        <Label></Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Quiz questions will appear here after generation...
                </p>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
