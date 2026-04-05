// Vite 빌드 후 실행: 루트의 정적 HTML/자산 파일들을 dist/ 로 복사.
// Cloudflare Pages 에서 `npm run build` 한 번으로 전체 사이트(React 타로 + 정적 HTML)가 배포되도록 함.
//
// 복사 대상:
//   - 루트의 *.html 중 tarot.html 을 제외한 모든 파일 (index, animal, blog-*, ...)
//   - 루트 레벨 메타 파일: ads.txt, robots.txt, robot.txt, sitemap.xml
//
// 주의: tarot.html 은 Vite 가 이미 dist/ 로 빌드했으므로 덮어쓰면 안 된다.

import { readdirSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = join(rootDir, 'dist');

if (!existsSync(distDir)) {
  console.error('[copy-static] dist/ 가 없습니다. 먼저 vite build 를 실행하세요.');
  process.exit(1);
}

const EXCLUDED_HTML = new Set(['tarot.html']);
const ROOT_META_FILES = ['ads.txt', 'robots.txt', 'robot.txt', 'sitemap.xml'];

let copiedHtml = 0;
let copiedMeta = 0;

for (const name of readdirSync(rootDir)) {
  if (!name.endsWith('.html')) continue;
  if (EXCLUDED_HTML.has(name)) continue;
  const src = join(rootDir, name);
  if (!statSync(src).isFile()) continue;
  copyFileSync(src, join(distDir, name));
  copiedHtml++;
}

for (const name of ROOT_META_FILES) {
  const src = join(rootDir, name);
  if (!existsSync(src)) continue;
  copyFileSync(src, join(distDir, name));
  copiedMeta++;
}

console.log(`[copy-static] HTML ${copiedHtml}개, 메타 파일 ${copiedMeta}개 → dist/ 복사 완료`);
