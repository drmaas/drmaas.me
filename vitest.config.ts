/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
  },
});
