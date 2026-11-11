import { sleep } from "@/lib/utils";
import { TwitterApiError } from "./errors";
import {
 CREDITS_PER_USD,
 ENDPOINT_CREDITS,
 type TwitterApiEndpoint,
} from "./types";
import { getMockResponse } from "./mock";

const BASE_URL = "https://api.twitterapi.io";
const DEFAULT_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 3;

export interface TwitterRequestMeta {
 endpoint: string;
 itemsReturned: number;
 estimatedCostCredits: number;
 estimatedCostUsd: number;
 usedMock: boolean;
}

export interface TwitterRequestResult<T> {
 data: T;
 meta: TwitterRequestMeta;
}

function hasApiKey() {
 return Boolean(process.env.TWITTERAPI_IO_KEY && process.env.TWITTERAPI_IO_KEY !== "PASTE_YOUR_TWITTERAPI_IO_API_KEY_HERE");
}

function shouldUseMock() {
 if (process.env.TWITTERAPI_IO_MOCK === "true") return true;
 return !hasApiKey();
}

function estimateCredits(endpoint: TwitterApiEndpoint, itemsReturned: number) {
 if (endpoint === "/twitter/user/info" || endpoint === "/twitter/user/batch_info_by_ids") {
 return Math.max(ENDPOINT_CREDITS.minimum, itemsReturned * ENDPOINT_CREDITS.user_info);
 }
 if (
 endpoint === "/twitter/user/tweet_timeline" ||
 endpoint === "/twitter/user/last_tweets"
 ) {
 return Math.max(ENDPOINT_CREDITS.minimum, itemsReturned * ENDPOINT_CREDITS.tweet);
 }
 if (endpoint === "/twitter/user/search") {
 return Math.max(ENDPOINT_CREDITS.minimum, itemsReturned * ENDPOINT_CREDITS.user_info);
 }
 return ENDPOINT_CREDITS.minimum;
}

export async function twitterRequest<T>(
 endpoint: TwitterApiEndpoint,
 params: Record<string, string | number | boolean | undefined> = {},
 options: { timeoutMs?: number; countItems?: (data: T) => number } = {},
): Promise<TwitterRequestResult<T>> {
 if (shouldUseMock()) {
 const data = getMockResponse<T>(endpoint, params);
 const items = options.countItems?.(data) ?? 1;
 const credits = estimateCredits(endpoint, items);
 return {
 data,
 meta: {
 endpoint,
 itemsReturned: items,
 estimatedCostCredits: credits,
 estimatedCostUsd: credits / CREDITS_PER_USD,
 usedMock: true,
 },
 };
 }

 const apiKey = process.env.TWITTERAPI_IO_KEY!;
 const search = new URLSearchParams();
 for (const [key, value] of Object.entries(params)) {
 if (value === undefined || value === null || value === "") continue;
 search.set(key, String(value));
 }

 const url = `${BASE_URL}${endpoint}${search.toString() ? `?${search}` : ""}`;
 let lastError: unknown;

 for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
 const controller = new AbortController();
 const timeout = setTimeout(
 () => controller.abort(),
 options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
 );

 try {
 const response = await fetch(url, {
 method: "GET",
 headers: {
 "X-API-Key": apiKey,
 Accept: "application/json",
 },
 signal: controller.signal,
 cache: "no-store",
 });

 clearTimeout(timeout);

 if (response.status === 429 || response.status === 402) {
 throw new TwitterApiError(
 response.status === 402
 ? "TwitterAPI.io credits exhausted"
 : "TwitterAPI.io rate limit exceeded",
 {
 status: response.status,
 code: response.status === 402 ? "credits" : "rate_limit",
 retryable: response.status === 429,
 },
 );
 }

 if (!response.ok) {
 const body = await response.text().catch(() => "");
 throw new TwitterApiError(
 `TwitterAPI.io request failed (${response.status}): ${body.slice(0, 200)}`,
 { status: response.status, retryable: response.status >= 500 },
 );
 }

 const data = (await response.json()) as T;
 const items = options.countItems?.(data) ?? 1;
 const credits = estimateCredits(endpoint, items);

 return {
 data,
 meta: {
 endpoint,
 itemsReturned: items,
 estimatedCostCredits: credits,
 estimatedCostUsd: credits / CREDITS_PER_USD,
 usedMock: false,
 },
 };
 } catch (error) {
 clearTimeout(timeout);
 lastError = error;
 const retryable =
 (error instanceof TwitterApiError && error.retryable) ||
 (error instanceof Error && error.name === "AbortError");
 if (!retryable || attempt === MAX_RETRIES - 1) break;
 await sleep(500 * 2 ** attempt);
 }
 }

 if (lastError instanceof TwitterApiError) throw lastError;
 throw new TwitterApiError(
 lastError instanceof Error ? lastError.message : "TwitterAPI.io request failed",
 { retryable: false },
 );
}
