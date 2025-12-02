import { PageProps } from "@/.next/types/app/layout";

export default async function ArticlesPage({ params }: PageProps) {
  // You can await the params here if needed, or pass the promise down
  const resolvedParams = await params;
  // ... your component logic using resolvedParams ...
}
