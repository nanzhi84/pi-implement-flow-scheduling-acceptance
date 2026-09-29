import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('../upper.mjs', import.meta.url);
const cliPath = fileURLToPath(moduleUrl);
function run(args) {
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  assert.equal(result.status, 0);
  return result.stdout;
}

assert.equal(run([cliPath, 'Ada']), 'HELLO, Ada!\n');
assert.equal(run([cliPath, 'Bea']), 'HELLO, Bea!\n');
assert.equal(run(['--input-type=module', '--eval', `
  import assert from 'node:assert/strict';
  const { upper } = await import(${JSON.stringify(moduleUrl.href)});
  assert.equal(typeof upper, 'function');
  assert.equal(upper('Ada'), 'HELLO, Ada!\\n');
  assert.equal(upper('Bea'), 'HELLO, Bea!\\n');
`]), '');

process.stdout.write(JSON.stringify({
  passed: true,
  assertions: [
    { name: 'upper-cli', passed: true },
    { name: 'upper-cli-bea', passed: true },
    { name: 'upper-import', passed: true },
  ],
}) + '\n');
