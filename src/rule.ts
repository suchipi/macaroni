export interface RuleAPI {
  readFile(filepath: string): string;
  options: { [key: string]: any };
}

export type Rule = (
  input: { path: string; content: string },
  api: RuleAPI
) => string;
