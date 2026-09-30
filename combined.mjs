import { upper } from './upper.mjs';
import { repeat } from './repeat.mjs';

const name = process.argv[2];
const count = Number(process.argv[3]);
process.stdout.write(upper(name) + repeat(name, count));
