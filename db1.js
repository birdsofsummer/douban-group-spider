const util = require('util');
const exec = util.promisify(require('child_process').exec);
const R=require("ramda")
const TABLES=["keywords","user"]

const find=(t)=>`bin/sqlite3 "black.sqlite3" "select * from ${t};"`
const read=async (t=TABLES)=>Promise.all(t.map(x=>exec(
    find(x))
    .then(x=>x.stdout)
    .then(x=>x.split('\n'))
)
)

module.exports={
  read,
}

