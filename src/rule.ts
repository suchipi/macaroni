export interface RuleAPI {
  readFile(filepath: string): string;
}

export type Rule = (
  input: { path: string; content: string },
  api: RuleAPI
) => string;
