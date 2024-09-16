import fs from "fs";
import path from "path";
import resolve from "resolve";

export function resolvePath(request: string) {
  if (path.isAbsolute(request) && fs.existsSync(request)) {
    return request;
  }

  return resolve.sync(request, {
    basedir: process.cwd(),
  });
}

export async function loadFile(filepath: string) {
  const ns = await import(filepath);
  return ns;
}
