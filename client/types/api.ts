export interface ApiError {
  error: string;
}

export type ApiResponse<T> = T | ApiError;

export function isApiError(response: unknown): response is ApiError {
  return typeof response === "object" && response !== null && "error" in response;
}
