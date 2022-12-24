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
    15   |                 const readFileStack = [...this._fileRequestStack];
    16   |                 if (readFileStack.includes(filepath)) {
    17 > |                     const err = new Error(\`Infinite loop detected; re...
    18   |                         .map((file) => path_1.default.relative(proces...
    19   |                         .join(\\", \\")}\`);
    20   |                     Object.assign(err, { readFileStack });

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
    {
      readFileStack: [
        [32m'<root dir>/test_fixtures/loop 1.txt'[39m,
        [32m'<root dir>/test_fixtures/loop 2.txt'[39m,
        [32m'<root dir>/test_fixtures/loop 3.txt'[39m
      ]
    }
    ",
      "stdout": "",
    }
  `);
});
