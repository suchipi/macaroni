import { Rule, RuleAPI } from "./rule";
import { Processor } from "./processor";
import { makeIncludeRule } from "./rules/include";

export { Rule, RuleAPI, Processor, makeIncludeRule };

export function process(
  file: string,
  options: { rules: Array<Rule>; maxIterations?: number }
) {
  const processor = new Processor(options.rules);
  return processor.process(file, options);
}
