// Custom require for JSON files
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

export const readJson = (file) => {
  return require(file);
};
