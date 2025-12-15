"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type ScoreItem = {
  id: number;
  score: number;
  article: {
    title: string;
  };
};

export function Scores() {
  const [scores, setScores] = useState<ScoreItem[]>([]);

  useEffect(() => {
    async function loadScores() {
      try {
        const res = await fetch("/api/score");
        if (!res.ok) return;
        const data = await res.json();
        setScores(data);
      } catch (error) {
        console.error("Scores load failed:", error);
      }
    }

    loadScores();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-medium">Scores</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-bold">Your scores</DropdownMenuLabel>
        {scores.length === 0 ? (
          <DropdownMenuItem>No scores yet</DropdownMenuItem>
        ) : (
          scores.map((score) => (
            <div key={score.id}>
              <DropdownMenuItem className="flex justify-between gap-4">
                <h1 className="max-w-40 truncate">{score.article.title}</h1>
                <div className="flex items-center">
                  <p className="font-bold">{score.score}</p>
                  <p className="text-gray-500">/ 5</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
