import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

test('frontend build produces index.html and assets', () => {
  const indexHtml = path.join(distDir, 'index.html');
  assert.ok(fs.existsSync(indexHtml), 'dist/index.html should exist');

  const content = fs.readFileSync(indexHtml, 'utf8');
  assert.ok(content.includes('id="root"'), 'index.html should contain root mount element');
  assert.ok(content.includes('GST HSN/SAC'), 'index.html should contain title or description');

  const assetsDir = path.join(distDir, 'assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets should exist');

  const files = fs.readdirSync(assetsDir);
  const jsFiles = files.filter((f) => f.endsWith('.js'));
  const cssFiles = files.filter((f) => f.endsWith('.css'));

  assert.ok(jsFiles.length > 0, 'should output at least one JS bundle');
  assert.ok(cssFiles.length > 0, 'should output at least one CSS bundle');
});
