import { redirect } from "next/navigation";
import { getSolutionsContent } from "@/lib/data-fetch";

interface PageProps {
  searchParams?: Promise<{ id?: string }>;
}

/** Legacy entry: /services-details-1?id=... → /services-details-1/[id] */
export default async function ServiceDetailsRedirectPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const queryId = resolvedSearchParams?.id;

  if (queryId) {
    redirect(`/services-details-1/${queryId}`);
  }

  const content = await getSolutionsContent();
  const firstActive = content?.solutions?.find((s) => s.isActive) || content?.solutions?.[0];

  if (firstActive?.id) {
    redirect(`/services-details-1/${firstActive.id}`);
  }

  redirect("/solutions");
}
