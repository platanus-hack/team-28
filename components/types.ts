export type MessageCheckResult = 'safe' | 'unsafe' | null;

export interface MessageCheckResponse {
  isSafe: boolean;
  error?: string;
}

export interface MessageCheckError {
  message: string;
  code?: string;
}
