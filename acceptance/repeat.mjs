import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('../repeat.mjs', import.meta.url);
const assertions = [];

for (const [name, count, expected, assertionName] of [
  ['Ada', 2, 'Hello, Ada!\nHello, Ada!\n', 'repeat-cli'],
  ['Bea', 1, 'Hello, Bea!\n', 'repeat-cli-count-1'],
  ['Ada', 3, 'Hello, Ada!\nHello, Ada!\nHello, Ada!\n', 'repeat-cli-count-3'],
]) {
  const result = spawnSync(process.execPath, [fileURLToPath(moduleUrl), name, String(count)], {
    encoding: 'utf8',
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, expected);
  assert.equal(result.stderr, '');
  assertions.push({ name: assertionName, passed: true });
}

const imported = spawnSync(process.execPath, ['--input-type=module', '--eval', `
  import assert from 'node:assert/strict';
  const { repeat } = await import(${JSON.stringify(moduleUrl.href)});
  assert.equal(typeof repeat, 'function');
  assert.equal(repeat('Ada', 2), 'Hello, Ada!\\nHello, Ada!\\n');
  assert.equal(repeat('Bea', 1), 'Hello, Bea!\\n');
  assert.equal(repeat('Ada', 3), 'Hello, Ada!\\nHello, Ada!\\nHello, Ada!\\n');
`], { encoding: 'utf8' });
assert.ifError(imported.error);
assert.equal(imported.status, 0);
assert.equal(imported.stdout, '');
assert.equal(imported.stderr, '');
assertions.push({ name: 'repeat-import', passed: true });

process.stdout.write(JSON.stringify({ passed: true, assertions }) + '\n');
