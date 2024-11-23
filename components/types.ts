export type MessageCheckResult = 'safe' | 'unsafe' | null;

export type MessageCheckError = {
  message: string;
  code: string;
};
