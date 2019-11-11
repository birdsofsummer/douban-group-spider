const sqlite3 = require('sqlite3').verbose();
//https://github.com/mapbox/node-sqlite3/tree/master/test


const fs=require('fs')
const R=require('ramda')

const FILE_NAME="./black.sqlite3"
const TABLES=["keywords","user"]


const conn=(file_name=FILE_NAME)=>new sqlite3.Database(file_name)

const query=(table="user")=>{
    const db = conn();
    return new Promise((f1,f2)=> db.all(`SELECT * FROM ${table}`,(e,d)=>e?f2(e):f1(d)))
}

const write=(file_name,d={})=>{
    d1=JSON.stringify(d,null,'\t')
    fs.writeFileSync(file_name,d1)
}

const init=(file_name=FILE_NAME,t=TABLES,cb=console.log)=>{
    db=conn()
    db = new sqlite3.Database(file_name, t.map(x=>db.run(`CREATE TABLE  IF NOT EXISTS ${x} (info TEXT)`, cb)));
}

const init1=()=>{
    ids=require('./black_id_list')
    keywords=require('./black_list')
    inserts(ids)
    inserts(keywords,"keywords")
}

const inserts=(d=[],table="user")=>{
    const db = conn();
    db.serialize(function() {
          db.run(`CREATE TABLE  IF NOT EXISTS ${table}  (info TEXT)`);
          var stmt = db.prepare(`INSERT INTO ${table} VALUES (?)`);
          d.forEach(x=>stmt.run(x))
          stmt.finalize();
    });
    db.close();
}

const clean=(t=TABLES)=>{
    const db = conn();
    return Promise.all(t.map(table=>new Promise((f1,f2)=> db.all(`delete FROM ${table}`,(e,d)=>e?f2(e):f1(d)))))
}


read=async ()=>{
    let r1=await  Promise.all(TABLES.map(query))
    return r1.map(x=>x.map(y=>y.info))

  //  z1=z.map(x=>R.pickAll(['name','userVid',"avatar"])(x))
  //  write("user.json",z)
  //  write("avatar.json",z1)
  //  return z1
}

module.exports={
  query,
  clean,
  read,
}

