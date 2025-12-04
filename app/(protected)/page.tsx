"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AppSidebar } from "../_components/app-sidebar";
import { ArticleSummarizer } from "../_components/Generator";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { POST } from "../api/generate/route";

export default function Home() {
  /*const [content, setContent] = useState<string>("");
  const getContent = async () => {
    const data = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    console.log("DATA", data);
  };*/

  /*useEffect(() => {
    getEmployees();
  }, []);*/
  return (
    <aside className="flex">
      <AppSidebar></AppSidebar>
      <ArticleSummarizer></ArticleSummarizer>
    </aside>
  );
}
