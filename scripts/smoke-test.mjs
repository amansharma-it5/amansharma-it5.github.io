import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const rootPath = root.pathname.replace(/^\//, '').replace(/^([A-Z]):/, '$1:');
const required = [
  'index.html',
  '404.html',
  'projects/index.html',
  'projects/civicproof/index.html',
  'projects/divyadhun/index.html',
  'projects/watchroom/index.html',
  'projects/instafetch/index.html',
  'projects/resume-fit-checker/index.html',
  'projects/frost-and-flowers/index.html',
  'projects/cpp-practice/index.html',
  'projects/leetcode-probs/index.html',
  'robots.txt',
  'sitemap.xml',
  'assets/images/instafetch-live.jpg',
  'assets/images/recruitos-ai-live.jpg',
  'assets/images/frost-flowers-live.jpg',
  'assets/images/social-card.jpg'
];

const missing = required.filter((file) => !existsSync(join(rootPath, file)));
if (missing.length) {
  console.error(`Missing build outputs:\n${missing.join('\n')}`);
  process.exit(1);
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
walk(rootPath);
const invalid = htmlFiles.filter((file) => !readFileSync(file, 'utf8').includes('<title>'));
if (invalid.length) {
  console.error(`HTML files without title:\n${invalid.join('\n')}`);
  process.exit(1);
}
console.log(`Smoke test passed: ${htmlFiles.length} HTML routes and ${required.length} required outputs verified.`);
