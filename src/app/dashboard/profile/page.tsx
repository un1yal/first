"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function PublicProfileSettingsPage() {
 const [loading, setLoading] = useState(true);
 const [slug, setSlug] = useState("");
 const [bio, setBio] = useState("");
 const [category, setCategory] = useState("");
 const [published, setPublished] = useState(false);
 const [visibility, setVisibility] = useState({
 show_followers: true,
 show_following: true,
 show_engagement: true,
 show_impressions: true,
 show_growth: true,
 show_posts: true,
 show_biography: true,
 });

 useEffect(() => {
 void (async () => {
 const res = await fetch("/api/creators/public-profile");
 const data = await res.json();
 if (data.profile) {
 setSlug(data.profile.slug ?? "");
 setBio(data.profile.public_bio ?? "");
 setCategory(data.profile.category ?? "");
 setPublished(Boolean(data.profile.is_published));
 setVisibility({ ...visibility, ...data.profile.visibility_settings });
 } else if (data.defaultSlug) {
 setSlug(data.defaultSlug);
 }
 setLoading(false);
 })();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 async function save(publish?: boolean) {
 const res = await fetch("/api/creators/public-profile", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 slug,
 public_bio: bio,
 category,
 is_published: publish ?? published,
 visibility_settings: visibility,
 }),
 });
 const data = await res.json();
 if (!res.ok) {
 toast.error(data.error || "Save failed");
 return;
 }
 setPublished(Boolean(data.profile.is_published));
 toast.success(publish ? "Profile published" : "Profile saved");
 }

 if (loading) {
 return <p className="text-sm text-muted-foreground">Loading…</p>;
 }

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-semibold tracking-tight">Public Profile</h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Control what visitors can see on your StatisticX creator page.
 </p>
 </div>

 <Card>
 <CardHeader>
 <CardTitle>Publishing</CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="space-y-2">
 <Label>Profile slug</Label>
 <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
 </div>
 <div className="space-y-2">
 <Label>Public bio</Label>
 <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
 </div>
 <div className="space-y-2">
 <Label>Category / niche</Label>
 <Input value={category} onChange={(e) => setCategory(e.target.value)} />
 </div>
 <div className="grid gap-2 sm:grid-cols-2">
 {Object.entries(visibility).map(([key, value]) => (
 <label key={key} className="flex items-center gap-2 text-sm">
 <input
 type="checkbox"
 checked={value}
 onChange={(e) =>
 setVisibility({ ...visibility, [key]: e.target.checked })
 }
 />
 {key.replaceAll("_", " ")}
 </label>
 ))}
 </div>
 <div className="flex flex-wrap gap-2">
 <Button onClick={() => save(false)} variant="secondary">
 Save draft
 </Button>
 <Button onClick={() => save(true)}>Publish profile</Button>
 <Button
 variant="outline"
 onClick={() => {
 setPublished(false);
 void save(false);
 }}
 >
 Unpublish
 </Button>
 <Button asChild variant="ghost">
 <a href={`/creator/${slug}`} target="_blank" rel="noreferrer">
 Preview
 </a>
 </Button>
 </div>
 </CardContent>
 </Card>
 </div>
 );
}
