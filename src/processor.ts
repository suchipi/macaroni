import fs from "fs";
import path from "path";
import { Rule, RuleAPI } from "./rule";

export class Processor {
  private _rules: Array<Rule>;
  private _api: RuleAPI;
  private _fileRequestStack: Array<string> = [];

  constructor(rules: Array<Rule>) {
    this._rules = rules;
    this._api = {
      readFile: (filepath: string) => {
        if (this._fileRequestStack.includes(filepath)) {
          const err = new Error(
            `Infinite loop detected; readFile stack: ${this._fileRequestStack
              .map((file) => path.relative(process.cwd(), file))
              .join(", ")}`
          );
          Object.assign(err, { readFileStack: this._fileRequestStack });
          throw err;
        }

        return this.process(filepath);
      },
    };
  }

  private _withStack<T>(filepath: string, callback: () => T): T {
    this._fileRequestStack.push(filepath);
    try {
      return callback();
    } finally {
      this._fileRequestStack.pop();
    }
  }

  process(
    filepath: string,
    { maxIterations = 10 }: { maxIterations?: number } = {}
  ): string {
    if (maxIterations < 1) {
      const err = new Error(`Invalid maxIterations value: ${maxIterations}`);
      Object.assign(err, { maxIterations });
      throw err;
    }

    if (!path.isAbsolute(filepath)) {
      const err = new Error(
        `Processor.process must be called with an absolute path, but it was called with: ${filepath}`
      );
      Object.assign(err, { filepath });
      throw err;
    }

    let content = fs.readFileSync(filepath, "utf-8");
    this._withStack(filepath, () => {
      let stable = false;
      let contentBefore: string;
      let iterations = 0;
      while (!stable && iterations < maxIterations) {
        contentBefore = content;
        for (const rule of this._rules) {
          content = rule({ path: filepath, content }, this._api);
        }
        iterations++;
        if (content === contentBefore) {
          stable = true;
        }
      }
      if (!stable) {
        console.warn(
          `${path.relative(
            process.cwd(),
            filepath
          )}: processed macro content was not stable after ${maxIterations} iterations.`
        );
      }
    });

    return content;
  }
}
