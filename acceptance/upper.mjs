import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('../upper.mjs', import.meta.url);
const cliPath = fileURLToPath(moduleUrl);
const assertions = [];

for (const [name, assertionName] of [['Ada', 'upper-cli'], ['Bea', 'upper-cli-bea']]) {
  const result = spawnSync(process.execPath, [cliPath, name], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `HELLO, ${name}!\n`);
  assertions.push({ name: assertionName, passed: true });
}

const imported = spawnSync(process.execPath, ['--input-type=module', '--eval', `
  import assert from 'node:assert/strict';
  const { upper } = await import(${JSON.stringify(moduleUrl.href)});
  assert.equal(typeof upper, 'function');
  assert.equal(upper('Ada'), 'HELLO, Ada!\\n');
  assert.equal(upper('Bea'), 'HELLO, Bea!\\n');
`], { encoding: 'utf8' });
assert.ifError(imported.error);
assert.equal(imported.status, 0, imported.stderr);
assert.equal(imported.stdout, '');
assertions.push({ name: 'upper-import', passed: true });

process.stdout.write(JSON.stringify({ passed: true, assertions }) + '\n');
