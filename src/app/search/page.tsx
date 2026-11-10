import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber, normalizeUsername, xProfileUrl } from "@/lib/utils";
import { searchCreators } from "@/lib/data/search";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = normalizeUsername(params.q ?? "");
  const data = q ? await searchCreators(q) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Results for {q ? `@${q}` : "—"}
        </p>

        {!q ? (
          <p className="mt-8 text-sm text-muted-foreground">Enter a username from the homepage.</p>
        ) : null}

        {data?.remote?.unavailable ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Account unavailable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{data.remote.message}</p>
            </CardContent>
          </Card>
        ) : null}

        {data?.remote && !data.remote.unavailable ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={data.remote.profile_image_url ?? undefined} />
                  <AvatarFallback>
                    {String(data.remote.display_name ?? data.remote.username)
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{data.remote.display_name}</p>
                  <p className="text-sm text-muted-foreground">@{data.remote.username}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatNumber(data.remote.followers_count)} followers
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    data.remote.claimed_status === "claimed" ? "success" : "warning"
                  }
                >
                  {data.remote.claimed_status === "claimed"
                    ? "Claimed on AnalyticX"
                    : "Unclaimed"}
                </Badge>
                {data.remote.claimed_status === "claimed" ? (
                  <Button asChild size="sm">
                    <Link href={`/creator/${data.remote.username}`}>Open profile</Link>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This creator hasn’t claimed their profile on AnalyticX yet.
                  </p>
                )}
                <Button asChild size="sm" variant="outline">
                  <a
                    href={xProfileUrl(String(data.remote.username))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in X
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {data && !data.remote && data.local?.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No matching account found.</p>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
