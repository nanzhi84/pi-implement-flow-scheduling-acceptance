import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const moduleURL = new URL('../upper.mjs', import.meta.url);
const cliPath = fileURLToPath(moduleURL);

function run(args, expected) {
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, expected);
  assert.equal(result.stderr, '');
}

run([cliPath, 'Ada'], 'HELLO, Ada!\n');
run([cliPath, 'Bea'], 'HELLO, Bea!\n');
run(['--input-type=module', '--eval', `
  import assert from 'node:assert/strict';
  const { upper } = await import(${JSON.stringify(moduleURL.href)});
  assert.equal(typeof upper, 'function');
  assert.equal(upper('Ada'), 'HELLO, Ada!\\n');
  assert.equal(upper('Bea'), 'HELLO, Bea!\\n');
`], '');

process.stdout.write(JSON.stringify({
  passed: true,
  assertions: [
    { name: 'upper-cli', passed: true },
    { name: 'upper-cli-another-name', passed: true },
    { name: 'upper-import-function-silent', passed: true },
  ],
}) + '\n');
