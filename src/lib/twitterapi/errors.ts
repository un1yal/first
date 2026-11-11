export class TwitterApiError extends Error {
 status: number;
 code?: string;
 retryable: boolean;

 constructor(
 message: string,
 options: { status?: number; code?: string; retryable?: boolean } = {},
 ) {
 super(message);
 this.name = "TwitterApiError";
 this.status = options.status ?? 500;
 this.code = options.code;
 this.retryable = options.retryable ?? false;
 }
}

export function isRateLimitError(error: unknown) {
 return error instanceof TwitterApiError && (error.status === 429 || error.code === "rate_limit");
}

export function isCreditsError(error: unknown) {
 return error instanceof TwitterApiError && error.status === 402;
}
