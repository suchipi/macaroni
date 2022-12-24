import { expect, test } from "vitest";
import { spawn } from "first-base";
import { pathMarker } from "path-less-traveled";
import path from "path";

const rootDir = pathMarker(path.join(__dirname, ".."));

test("basic test", async () => {
  const run = spawn(
    rootDir("dist/cli.js"),
    ["--include-paths", "test_fixtures", "test_fixtures/something.txt"],
    { cwd: rootDir() }
  );
  await run.completion;
  expect(run.result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi
    hello from something 2hi from something 3
    yeah
    there
    ",
    }
  `);
});

test("include loop", async () => {
  const run = spawn(rootDir("dist/cli.js"), ["loop 1.txt"], {
    cwd: rootDir("test_fixtures"),
  });
  await run.completion;
  run.result.stdout = run.result.stdout
    .replace(new RegExp(rootDir(), "g"), "<root dir>")
    .replace(/:\d+:\d+/g, ":line:col");
  run.result.stderr = run.result.stderr
    .replace(new RegExp(rootDir(), "g"), "<root dir>")
    .replace(/:\d+:\d+/g, ":line:col");

  expect(run.result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Infinite loop detected; readFile stack: loop 1.txt, loop 2.txt, loop 3.txt

    ./../dist/processor.js:line:col                                                   
    14   |             readFile: (filepath) => {
    15   |                 if (this._fileRequestStack.includes(filepath)) {
    16 > |                     const err = new Error(\`Infinite loop detected; re...
    17   |                         .map((file) => path_1.default.relative(proces...
    18   |                         .join(\\", \\")}\`);
    19   |                     Object.assign(err, { readFileStack: this._fileReq...

      at Object.readFile (<root dir>/dist/processor.js:line:col)
      at <root dir>/dist/rules/include.js:line:col
      at String.replace (<anonymous>)
      at <root dir>/dist/rules/include.js:line:col
      at <root dir>/dist/processor.js:line:col
      at Processor._withStack (<root dir>/dist/processor.js:line:col)
      at Processor.process (<root dir>/dist/processor.js:line:col)
      at Object.readFile (<root dir>/dist/processor.js:line:col)
      at <root dir>/dist/rules/include.js:line:col
      at String.replace (<anonymous>)
    The above error also had these properties on it:
    { readFileStack: [] }
    ",
      "stdout": "",
    }
  `);
});
