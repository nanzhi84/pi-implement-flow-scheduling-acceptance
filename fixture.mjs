import { lstat, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.env.FLOW_RESOURCE_DIR;
if (!root) throw new Error('FLOW_RESOURCE_DIR required');
const mode = process.argv[2];
if (mode === 'prepare') {
  if (process.env.FLOW_FIXTURE_FAIL_PREPARE === '1') throw new Error('Injected preparation failure');
  if (process.env.FLOW_FIXTURE_CHANGE_HEAD === '1') execFileSync('git', ['checkout', '--detach', 'HEAD^'], { stdio: 'pipe' });
  await mkdir(join(root, 'data'), { recursive: true });
} else if (mode === 'cleanup') {
  await rm(join(root, 'data'), { recursive: true, force: true });
} else if (mode === 'check') {
  execFileSync(process.execPath, ['--check', 'app.mjs'], { stdio: 'pipe' });
} else if (mode === 'accept') {
  if (execFileSync(process.execPath, ['app.mjs', ' Ada '], { encoding: 'utf8' }) !== 'Hello,  Ada !\n') throw new Error('surrounding-name-spaces');
  const greeting = execFileSync(process.execPath, ['app.mjs', 'Ada'], { encoding: 'utf8' });
  if (greeting !== 'Hello, Ada!\n') throw new Error('greeting contract failed');
  let rejected = false;
  try { execFileSync(process.execPath, ['app.mjs'], { stdio: 'pipe' }); }
  catch (error) { rejected = error.status === 2; }
  if (!rejected) throw new Error('missing-name contract failed');
  const assertions = [
    { name: 'greeting-for-name', passed: true },
    { name: 'missing-name-rejected', passed: true },
  ];
  let entries = [];
  try {
    if (!(await lstat('acceptance')).isDirectory()) throw new Error('Acceptance directory must be a regular directory');
    entries = await readdir('acceptance', { withFileTypes: true });
  }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const names = new Set(assertions.map(item => item.name));
  for (const entry of entries.filter(item => item.name.endsWith('.mjs')).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile()) throw new Error('Acceptance scripts must be regular files');
    const output = execFileSync(process.execPath, [join('acceptance', entry.name)], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 45000, maxBuffer: 262144,
    });
    const result = JSON.parse(output);
    if (!result || Object.keys(result).sort().join(',') !== 'assertions,passed' || result.passed !== true
      || !Array.isArray(result.assertions) || !result.assertions.length) throw new Error('Invalid acceptance result');
    for (const item of result.assertions) {
      if (!item || Object.keys(item).sort().join(',') !== 'name,passed'
        || typeof item.name !== 'string' || !/^[a-z0-9._-]{1,80}$/.test(item.name)
        || item.passed !== true || names.has(item.name)) throw new Error('Invalid or duplicate acceptance assertion');
      names.add(item.name); assertions.push(item);
    }
  }
  process.stdout.write(JSON.stringify({ passed: true, assertions }) + '\n');
} else {
  throw new Error('Unsupported fixture phase');
}
