import { Rule, RuleAPI } from "./rule";
import { Processor } from "./processor";
import { includeRule } from "./rules/include";

export { Rule, RuleAPI, Processor, includeRule };

export function process(
  file: string,
  options: { rules: Array<Rule>; maxIterations?: number; [key: string]: any }
) {
  const { rules, maxIterations, ...others } = options;
  const processor = new Processor(options.rules, others);
  return processor.process(file, { maxIterations });
}
