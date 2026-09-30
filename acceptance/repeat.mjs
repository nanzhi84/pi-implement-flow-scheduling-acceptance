import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const moduleURL = new URL('../repeat.mjs', import.meta.url);
const cli = fileURLToPath(moduleURL);
const assertions = [];

function run(args, expected) {
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0);
  assert.equal(result.signal, null);
  assert.equal(result.stdout, expected);
  assert.equal(result.stderr, '');
}

run([cli, 'Ada', '2'], 'Hello, Ada!\nHello, Ada!\n');
assertions.push({ name: 'repeat-cli', passed: true });
run([cli, 'Bea', '1'], 'Hello, Bea!\n');
assertions.push({ name: 'repeat-count-one', passed: true });
run([cli, 'Ada', '3'], 'Hello, Ada!\nHello, Ada!\nHello, Ada!\n');
assertions.push({ name: 'repeat-count-three', passed: true });

run(['--input-type=module', '--eval', `
  import assert from 'node:assert/strict';
  const { repeat } = await import(${JSON.stringify(moduleURL.href)});
  assert.equal(typeof repeat, 'function');
  assert.equal(repeat('Ada', 2), 'Hello, Ada!\\nHello, Ada!\\n');
  assert.equal(repeat('Bea', 1), 'Hello, Bea!\\n');
  assert.equal(repeat('Bea', 3), 'Hello, Bea!\\nHello, Bea!\\nHello, Bea!\\n');
`, 'Ada', '2'], '');
assertions.push({ name: 'repeat-import-silent-and-function', passed: true });

process.stdout.write(JSON.stringify({ passed: true, assertions }) + '\n');
