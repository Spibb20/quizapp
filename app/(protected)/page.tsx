"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AppSidebar } from "../_components/app-sidebar";
import { ArticleSummarizer } from "../_components/Generator";
import { SignedIn } from "@clerk/nextjs";

export default function Home() {
  const getEmployees = async () => {
    const data = await fetch("/api/employees");
    console.log("DATA");
  };

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
