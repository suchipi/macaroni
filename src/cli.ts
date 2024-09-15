#!/usr/bin/env node
import * as clefairy from "clefairy";
import path from "path";
import * as macaroni from "./index";
import { includeRule } from "./rules/include";
import { helpText } from "./help";

const pkg = require("../" + "package.json");

const argsObject = {
  help: clefairy.optionalBoolean,
  h: clefairy.optionalBoolean,

  version: clefairy.optionalBoolean,
  v: clefairy.optionalBoolean,

  includePaths: clefairy.optionalString,
  maxIterations: clefairy.optionalNumber,
  rules: clefairy.optionalString,
} as const;

export type Options = clefairy.ArgsObjectToOptions<typeof argsObject>;

export default function main(options: Options, ...files: Array<string>) {
  if (options.help || options.h) {
    console.log(helpText);
    return;
  }

  if (options.version || options.v) {
    process.stdout.write(pkg.version);
    return;
  }

  if (files.length === 0) {
    throw new Error(
      "Please specify one or more files to process as positional arguments"
    );
  }

  let out: Array<string> = [];

  const parseCommaSepPaths = (input: string) =>
    input
      .split(",")
      .map((somePath) =>
        path.isAbsolute(somePath)
          ? somePath
          : path.resolve(process.cwd(), somePath)
      );

  const includePaths = options.includePaths
    ? parseCommaSepPaths(options.includePaths)
    : [process.cwd()];

  const rules = options.rules
    ? parseCommaSepPaths(options.rules).map((file) =>
        require(file.startsWith(".") ? path.resolve(process.cwd(), file) : file)
      )
    : [includeRule];

  for (const file of files) {
    const absFile = path.isAbsolute(file)
      ? file
      : path.resolve(process.cwd(), file);

    const result = macaroni.process(absFile, {
      rules,
      maxIterations: options.maxIterations ?? 10,
      includePaths,
    });
    out.push(result);
  }

  process.stdout.write(out.join(""));
}

if (module === require.main) {
  clefairy.run(argsObject, main);
}
