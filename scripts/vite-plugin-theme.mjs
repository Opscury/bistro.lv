/* Vite: `import "virtual:theme.css"` → fonti no src/data/theme.json,
   un <link rel="preload"> virsrakstu fontam index.html galvā. */

import { readTheme, themeCss, preloadTags, themeFile } from "./theme.mjs";

const ID = "virtual:theme.css";
const RESOLVED = "\0virtual:theme.css";

export default function themePlugin() {
  return {
    name: "silva-theme",
    resolveId(id) {
      if (id === ID) return RESOLVED;
    },
    load(id) {
      if (id !== RESOLVED) return;
      this.addWatchFile(themeFile);
      return themeCss(readTheme());
    },
    transformIndexHtml() {
      return preloadTags(readTheme());
    },
    handleHotUpdate({ file, server }) {
      if (file === themeFile) {
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.reloadModule(mod);
      }
    },
  };
}
