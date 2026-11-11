"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { normalizeUsername } from "@/lib/utils";

type Step = "username" | "confirm" | "verify" | "done";

export default function OnboardingPage() {
 const router = useRouter();
 const [step, setStep] = useState<Step>("username");
 const [username, setUsername] = useState("");
 const [loading, setLoading] = useState(false);
 const [profile, setProfile] = useState<{
 display_name: string;
 username: string;
 followers_count: number;
 biography: string | null;
 profile_image_url: string | null;
 x_user_id: string;
 } | null>(null);
 const [code, setCode] = useState<string | null>(null);
 const [challengeId, setChallengeId] = useState<string | null>(null);

 async function lookup() {
 setLoading(true);
 try {
 const res = await fetch("/api/creators/lookup", {
 method: "POST",
 credentials: "include",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ username: normalizeUsername(username) }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || "Lookup failed");
 setProfile(data.profile);
 setStep("confirm");
 } catch (error) {
 toast.error(error instanceof Error ? error.message : "Lookup failed");
 } finally {
 setLoading(false);
 }
 }

 async function startVerification() {
 setLoading(true);
 try {
 const res = await fetch("/api/creators/claim/start", {
 method: "POST",
 credentials: "include",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ username: normalizeUsername(username) }),
 });
 const data = await res.json();
 if (res.status === 401) {
 toast.error("Session missing — please log in again");
 router.push("/login?next=/onboarding");
 return;
 }
 if (!res.ok) throw new Error(data.error || "Could not start verification");
 setCode(data.code);
 setChallengeId(data.challengeId);
 setStep("verify");
 toast.message("Add the code to your X bio", {
 description: "This verifies ownership. It is not X OAuth authorization.",
 });
 } catch (error) {
 toast.error(error instanceof Error ? error.message : "Verification start failed");
 } finally {
 setLoading(false);
 }
 }

 async function confirmVerification() {
 setLoading(true);
 try {
 const res = await fetch("/api/creators/claim/verify", {
 method: "POST",
 credentials: "include",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 username: normalizeUsername(username),
 challengeId,
 code,
 }),
 });
 const data = await res.json();
 if (res.status === 401) {
 toast.error("Session missing — please log in again");
 router.push("/login?next=/onboarding");
 return;
 }
 if (!res.ok) throw new Error(data.error || "Verification failed");
 setStep("done");
 toast.success("Account claimed");
 } catch (error) {
 toast.error(error instanceof Error ? error.message : "Verification failed");
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="flex min-h-dvh flex-col">
 <SiteHeader isAuthenticated />
 <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10">
 <Card>
 <CardHeader>
 <CardTitle>Connect your X account</CardTitle>
 <CardDescription>
 Ownership is verified with a temporary bio code. This does not grant StatisticX OAuth access to post as you.
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-5">
 {step === "username" ? (
 <div className="space-y-4">
 <div className="space-y-2">
 <Label htmlFor="username">X username</Label>
 <Input
 id="username"
 placeholder="username"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 />
 </div>
 <Button onClick={lookup} disabled={loading || !username} className="w-full">
 {loading ? "Looking up…" : "Continue"}
 </Button>
 </div>
 ) : null}

 {step === "confirm" && profile ? (
 <div className="space-y-4">
 <div className="border border-border bg-secondary/30 p-4">
 <p className="font-medium">{profile.display_name}</p>
 <p className="text-sm text-muted-foreground">@{profile.username}</p>
 <p className="mt-2 text-sm text-muted-foreground">{profile.biography}</p>
 <p className="mt-3 text-xs text-muted-foreground">
 {profile.followers_count.toLocaleString()} followers · status pending verification
 </p>
 </div>
 <div className="flex gap-2">
 <Button variant="outline" onClick={() => setStep("username")} className="flex-1">
 Back
 </Button>
 <Button onClick={startVerification} disabled={loading} className="flex-1">
 {loading ? "Starting…" : "Confirm & verify"}
 </Button>
 </div>
 </div>
 ) : null}

 {step === "verify" ? (
 <div className="space-y-4">
 <Badge variant="warning">Pending verification</Badge>
 <p className="text-sm text-muted-foreground">
 Add this exact code anywhere in your X bio, then click verify. Codes expire in 30 minutes and are single-use.
 </p>
 <div className="border border-border bg-card px-4 py-5 text-center text-lg tracking-[0.2em]">
 {code}
 </div>
 <Button onClick={confirmVerification} disabled={loading} className="w-full">
 {loading ? "Checking bio…" : "I added the code — verify"}
 </Button>
 </div>
 ) : null}

 {step === "done" ? (
 <div className="space-y-4">
 <Badge variant="success">Claimed</Badge>
 <p className="text-sm text-muted-foreground">
 Your X account is claimed on StatisticX. You can publish a public profile from settings and sync analytics from your dashboard.
 </p>
 <Button onClick={() => router.push("/dashboard")} className="w-full">
 Open dashboard
 </Button>
 </div>
 ) : null}
 </CardContent>
 </Card>
 </main>
 <SiteFooter />
 </div>
 );
}
