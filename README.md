# `@suchipi/macaroni`

very barebones macro processor, written in node.js

it processes macros recursively until the resulting output is stable (though it does have a configurable max iterations limit after which point it'll bail out even if output isn't stable). if one file requests another file which requests the first file, it detects the infinite loop and errors out.

out of the box, it only has one macro: `#INCLUDE("some-file.txt")`, which puts the content from "some-file.txt" into the spot where the `#INCLUDE(...)` appears. but, you can define your own macro rules using JavaScript.

## usage

```
npm i -D @suchipi/macaroni
npx macaroni [options] <files...>
```

run `npx macaroni --help` for more into

## custom rules

you can define your own macro rules using JavaScript. here's an example rule which replaces all occurrences of `VERSION` with `"v1.2.3"`

```js
function versionRule(input, api) {
  // input has two properties: { path: string, content: string }
  // api has one property: { readFile(filepath: string): string; }

  // you should process `input.content` as desired, then return a string
  // (the new content after your processing)
  return input.content.replace(/VERSION/g, '"v1.2.3"');
}

module.exports = versionRule;
```

see the file "src/rules/include.ts" in the git repo for a more complex rule

## license

MIT
