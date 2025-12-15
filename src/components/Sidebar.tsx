"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SpinnerHistory } from "./Loading/LoadingHistory";

type ArticleItem = {
  id: number;
  title: string;
  content?: string | null;
  summary?: string | null;
};

export function AppSidebar() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const sidebar = useSidebar();

  async function loadArticles() {
    try {
      setError("");
      const res = await fetch("/api/articles");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load articles.");
      }

      setArticles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();

    const handleCreated = (event: Event) => {
      const customEvent = event as CustomEvent<ArticleItem>;
      setArticles((prev) => [
        customEvent.detail,
        ...prev.filter((item) => item.id !== customEvent.detail.id),
      ]);
    };

    window.addEventListener("article-created", handleCreated);
    return () => window.removeEventListener("article-created", handleCreated);
  }, []);

  async function edit() {
    if (!selectedId || !editedTitle.trim()) return;

    try {
      const res = await fetch("/api/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, title: editedTitle.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Edit failed.");
      }

      setArticles(data);
      setIsDialogOpen(false);
      setSelectedId(null);
      setEditedTitle("");
      router.refresh();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  }

  async function confirmAndDelete() {
    if (!selectedId) return;

    try {
      const res = await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed.");
      }

      setArticles(data);
      setIsDeleteDialogOpen(false);
      setSelectedId(null);
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  return (
    <Sidebar className="mt-14">
      <SidebarTrigger className="absolute right-2 top-1" />

      {loading ? (
        <SpinnerHistory />
      ) : sidebar?.state === "expanded" ? (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-2xl font-bold">
              History
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {error ? (
                <p className="px-3 text-sm text-red-600">{error}</p>
              ) : null}
              {!error && articles.length === 0 ? (
                <p className="px-3 text-sm text-gray-500">
                  No saved articles yet.
                </p>
              ) : null}
              <SidebarMenu>
                {articles.map((item) => (
                  <SidebarMenuItem key={item.id} className="my-2">
                    <SidebarMenuButton asChild>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-full truncate text-left text-[18px]"
                            onClick={() => router.push(`/quiz/${item.id}`)}
                          >
                            {item.title}
                          </button>
                        </ContextMenuTrigger>

                        <ContextMenuContent>
                          <Dialog
                            open={isDialogOpen && selectedId === item.id}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <ContextMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedId(item.id);
                                  setEditedTitle(item.title);
                                  setIsDialogOpen(true);
                                }}
                              >
                                Edit
                              </ContextMenuItem>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit your article</DialogTitle>
                              </DialogHeader>

                              <Input
                                placeholder="Type your edited title"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                              />

                              <Button className="mt-4" onClick={edit}>
                                Save
                              </Button>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={isDeleteDialogOpen && selectedId === item.id}
                            onOpenChange={setIsDeleteDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <ContextMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedId(item.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                              >
                                Delete
                              </ContextMenuItem>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure you want to delete this article?
                                </DialogTitle>
                              </DialogHeader>

                              <Button
                                className="mt-4 rounded-2xl border bg-white text-red-600 focus:bg-red-50 focus:text-red-700"
                                onClick={confirmAndDelete}
                              >
                                Delete
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </ContextMenuContent>
                      </ContextMenu>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      ) : null}
    </Sidebar>
  );
}
