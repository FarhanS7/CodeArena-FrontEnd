import fs from 'fs';
import path from 'path';

const APP_DIR = path.resolve(process.cwd(), 'app');
const PAGE_FILE_REGEX = /^page\.(ts|tsx|js|jsx)$/;

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (PAGE_FILE_REGEX.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeRouteFromFile(filePath) {
  const relative = path.relative(APP_DIR, path.dirname(filePath));

  if (!relative || relative === '.') {
    return '/';
  }

  const segments = relative
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => {
      // Ignore route groups and parallel route folders.
      if (segment.startsWith('(') && segment.endsWith(')')) return false;
      if (segment.startsWith('@')) return false;
      return true;
    });

  if (segments.length === 0) {
    return '/';
  }

  return `/${segments.join('/')}`;
}

function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error(`App directory not found: ${APP_DIR}`);
    process.exit(1);
  }

  const pageFiles = walk(APP_DIR);
  const seen = new Map();
  const collisions = [];

  for (const file of pageFiles) {
    const route = normalizeRouteFromFile(file);
    const existing = seen.get(route);

    if (existing && existing !== file) {
      collisions.push({ route, first: existing, second: file });
      continue;
    }

    seen.set(route, file);
  }

  if (collisions.length > 0) {
    console.error('Route collisions detected:');
    for (const collision of collisions) {
      const first = path.relative(process.cwd(), collision.first);
      const second = path.relative(process.cwd(), collision.second);
      console.error(`  ${collision.route}`);
      console.error(`    - ${first}`);
      console.error(`    - ${second}`);
    }
    process.exit(1);
  }

  console.log(`No route collisions detected across ${pageFiles.length} page files.`);
}

main();
