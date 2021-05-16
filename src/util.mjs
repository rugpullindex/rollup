// @format
import { readFileSync } from "fs";

export function load(path) {
  return readFileSync(path);
}
