import { NextResponse } from "next/server";
import { syncCreatorProfile } from "@/lib/sync/creator-sync";
import { normalizeUsername } from "@/lib/utils";
import { demoStore } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/data/mode";

export async function POST(request: Request) {
 try {
 const body = (await request.json()) as { username?: string };
 const username = normalizeUsername(body.username ?? "");
 if (!username) {
 return NextResponse.json({ error: "Username required" }, { status: 400 });
 }

 const result = await syncCreatorProfile(username);
 if (!result.ok) {
 return NextResponse.json(
 { error: result.error, unavailable: "unavailable" in result },
 { status: 404 },
 );
 }

 let claimedStatus = "unclaimed";
 if (isDemoMode()) {
 const existing = demoStore.creators.find(
 (c) => c.username.toLowerCase() === username.toLowerCase(),
 );
 claimedStatus = existing?.claimed_status ?? "unclaimed";
 }

 return NextResponse.json({
 profile: {
 ...result.fields,
 claimed_status: claimedStatus,
 },
 meta: result.meta,
 });
 } catch (error) {
 return NextResponse.json(
 { error: error instanceof Error ? error.message : "Lookup failed" },
 { status: 500 },
 );
 }
}
