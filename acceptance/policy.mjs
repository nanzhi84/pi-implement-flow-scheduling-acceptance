import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
assert.equal(JSON.parse(readFileSync('policy.json','utf8')).prefix,'HELLO');
console.log(JSON.stringify({passed:true,assertions:[{name:'policy-prefix',passed:true}]}));
