const fs = require('fs');
const lang = require('./lang');
const r = require('readline-sync');


let exec = new lang.Execution('main','nil')
/*
var seal = fs.readFileSync('./seal.txt', {encoding:'utf8', flag:'r'});
var done = lang.sort(seal)
for(let a in done){
  exec.line(done[a])
}
*/
let s = 1001
while(s != 0){
  s--
  let a = r.question('\x1b[36;44;1m>\x1b[32;40;4m')
  exec.line(a)
}