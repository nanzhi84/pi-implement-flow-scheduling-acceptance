import {existsSync,readFileSync} from 'node:fs';
const prefix=existsSync('policy.json')?JSON.parse(readFileSync('policy.json','utf8')).prefix:'Hello';
console.log(`${prefix}, ${process.argv[2]}!`);
