"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AppSidebar } from "../_components/app-sidebar";
import { ArticleSummarizer } from "../_components/Generator";

export default function Home() {
  const getEmployees = async () => {
    const data = await fetch("/api/employees");
    console.log("DATA");
  };

  /*useEffect(() => {
    getEmployees();
  }, []);*/
  return (
    <div>
      <AppSidebar></AppSidebar>
      <ArticleSummarizer></ArticleSummarizer>
    </div>
  );
}
