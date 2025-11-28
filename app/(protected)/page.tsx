"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const getEmployees = async () => {
    const data = await fetch("/api/employees");
    console.log("DATA");
  };

  useEffect(() => {
    getEmployees();
  }, []);
  return <div></div>;
}
