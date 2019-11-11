const request = require('superagent')
const superagent=require('superagent-charset')(request)
const agent = superagent.agent();
const R=require("ramda")

const { parser, }=require("./parser")
const {url2headers} = require("./ua")


const get=(x)=>{
    let headers= url2headers(x)
    let req=agent
        .get(x)
        .charset()
        .buffer(true)
     R.mapObjIndexed((v,k,o)=>req.set(k,v))(headers)
     return req
}
const get_json=(u)=> superagent.get(u).type('json')
const get_jsons=(u=[])=> Promise.all(u.map(get_json))

const post_json=(u,d)=>superagent
    .post(u,d)
    .set("Content-type","application/json")
    .type('json')

const gets=(u=[])=>Promise.all(u.map(get))

module.exports={
    get,
    gets,
    superagent,
    get_json,
    post_json,
    get_jsons,
}
