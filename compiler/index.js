import { parse } from "marked";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

init(process.argv[1], process.argv[2]);
function init(start, path) {
  const base = resolve(start, "../../");
  const files = readdirSync(base);
  const output = [];
  for (const file of files) {
    if (file.endsWith(".md")) output.push(compile(resolve(base, file)));
  }
  if (!path) throw "Output path not provided"
  writeFileSync(path, JSON.stringify(output));
}

function compile(path) {
  const file = readFileSync(path, "utf-8");
  const tags = file.match(/<!-*.*-*>/);
  const heading = file.match(/#.*\n/)
  if (!heading) throw "Heading not found for " + path;
  if (!tags) throw "Tag not found for " + path;

  return {
    tags: tags[0]
      .replace(/<!-*/, "")
      .replace(/-*>/, "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    heading: heading[0].replace("#", "").trim(),
    html: parse(file)
  };
}
