export type MessageCheckResult = {
  isSafe: boolean;
  explanation: string | null;
  safetyTips: string[] | null;
  recommendedActions: string[] | null;
} | null;

export type MessageCheckError = {
  message: string;
  code: string;
};
