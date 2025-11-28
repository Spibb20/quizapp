import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "../_components/Header";
import { AppSidebar } from "../_components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <body>
        <SidebarTrigger />
        <Header></Header>

        {children}
      </body>
    </SidebarProvider>
  );
}
