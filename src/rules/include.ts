import fs from "fs";
import path from "path";
import { Rule } from "../rule";

function findFile(target: string, includePaths: Array<string>) {
  for (const includePath of includePaths) {
    const potentialPath = path.join(includePath, target);
    if (fs.existsSync(potentialPath)) {
      return potentialPath;
    }
  }

  const err = new Error(`Could not find file in include paths: ${target}`);
  Object.assign(err, {
    requestedFile: target,
    includePaths,
  });
  throw err;
}

export const includeRule: Rule = (input, api) => {
  const includePaths = api.options.includePaths || [process.cwd()];

  return input.content.replace(/#INCLUDE\(([^)]+)\)/g, (match, target) => {
    const parsedTarget = JSON.parse(target);
    const file = findFile(parsedTarget, includePaths);
    const content = api.readFile(file);
    return content;
  });
};
