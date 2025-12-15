import { Navbar } from "@/components/Navbar";
import { Scores } from "@/components/Scores";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full">
        <header className="flex h-14 w-full items-center justify-between border-b px-6 lg:px-10">
          <Navbar />
          <div className="flex items-center gap-6">
            <Scores />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <AppSidebar />
          <main className="flex flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
