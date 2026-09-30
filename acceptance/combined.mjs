import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('../combined.mjs', import.meta.url));

function check(name, count, expected) {
  const result = spawnSync(process.execPath, [cliPath, name, count], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, expected);
  assert.equal(result.stderr, '');
}

check('Ada', '2', 'HELLO, Ada!\nHello, Ada!\nHello, Ada!\n');
check('Bea', '1', 'HELLO, Bea!\nHello, Bea!\n');

process.stdout.write(JSON.stringify({
  passed: true,
  assertions: [
    { name: 'combined-cli', passed: true },
    { name: 'combined-cli-bea-one', passed: true },
  ],
}) + '\n');
