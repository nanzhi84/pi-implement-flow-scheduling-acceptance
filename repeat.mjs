import { pathToFileURL } from 'node:url';

export function repeat(name, count) {
  return `Hello, ${name}!\n`.repeat(count);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(repeat(process.argv[2], Number(process.argv[3])));
}
