import { pathToFileURL } from 'node:url';

export function upper(name) {
  return `HELLO, ${name}!\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(upper(process.argv[2]));
}
