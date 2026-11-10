"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeUsername } from "@/lib/utils";

export function HomepageSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = normalizeUsername(query);
    if (!value) {
      setError("Enter an X username to search.");
      return;
    }
    if (!/^[a-z0-9_]{1,15}$/i.test(value)) {
      setError("Usernames can include letters, numbers, and underscores.");
      return;
    }
    setError(null);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="animate-fade-up-delay w-full">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an X username…"
          className="h-12 rounded-xl border-border bg-card pr-12 text-base"
          aria-label="Search an X username"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1 h-10 w-10"
          disabled={pending}
          aria-label="Search"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </form>
  );
}
