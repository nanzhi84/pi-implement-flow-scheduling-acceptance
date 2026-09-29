import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
assert.equal(execFileSync(process.execPath,["semantic.mjs",'Ada'],{encoding:'utf8'}),"Hello, Ada!\n");
console.log(JSON.stringify({passed:true,assertions:[{name:"semantic-original",passed:true}]}));
