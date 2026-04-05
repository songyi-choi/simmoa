import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// simmoa 배포 전략:
// - tarot.html: Vite + React 엔트리 (이 파일만 Vite가 파싱·번들링)
// - 루트의 나머지 *.html (index, animal, blog-*, ...): Vite가 손대지 않음.
//   빌드 후 scripts/copy-static.mjs 가 dist/ 로 복사하여 함께 배포.
// - public/*: Vite가 자동으로 dist/ 로 복사 (이미지 등 정적 자산)
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      input: {
        tarot: path.resolve(__dirname, "tarot.html"),
      },
    },
  },
}));
