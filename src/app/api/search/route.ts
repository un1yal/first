import { NextResponse } from "next/server";
import { searchCreators } from "@/lib/data/search";
import { normalizeUsername } from "@/lib/utils";

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const q = normalizeUsername(searchParams.get("q") ?? "");
 if (!q) {
 return NextResponse.json({ error: "Missing q" }, { status: 400 });
 }

 const data = await searchCreators(q);
 return NextResponse.json(data);
}
