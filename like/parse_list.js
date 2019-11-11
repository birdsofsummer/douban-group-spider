const fs=require('fs')
const {parser}=require("./parser")
const {get_history}=require("./db")


const parser1=({body,...x})=>({...x,list:parser(body)})
const save_json=(name="history1.json",json={})=>fs.writeFileSync(name,JSON.stringify(json,null,'\t'))

const main=async ()=>{
    const r=await get_history()
    let r1=r
        .map(parser1)
        .filter(x=>x.list.length)
    r2=R.groupBy(x=>x.group,r1)
    save_json("./history1.json",r2)
}

