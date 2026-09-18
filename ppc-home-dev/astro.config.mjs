import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(path)));
    } else {
      files.push(path);
    }
  }

  return files;
}

function rewriteHtml(source) {
  return source.replace(/\s(href|src|action)="\/(?!\/)/g, ' $1="./');
}

function rewriteCss(source) {
  return source.replace(/url\(\s*(['"]?)\/assets\//g, 'url($1../assets/');
}

function portableStaticPaths() {
  return {
    name: 'ppc-portable-static-paths',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const files = await walkFiles(fileURLToPath(dir));

        for (const file of files) {
          const ext = extname(file);
          if (ext !== '.html' && ext !== '.css') continue;

          const source = await readFile(file, 'utf8');
          const next = ext === '.html' ? rewriteHtml(source) : rewriteCss(source);
          if (next === source) continue;
          await writeFile(file, next);
        }
      },
    },
  };
}

export default defineConfig({
  base: '/',
  output: 'static',
  integrations: [portableStaticPaths()],
  server: {
    port: 4322,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
});
