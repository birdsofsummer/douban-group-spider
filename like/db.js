const { get_json, post_json, }=require("./ajax")
const {DB_HOST} =require("./config")

const create_index=(fields=["code"])=>{
    let u=DB_HOST+"/test/_index"
    let d={"index":{fields}}
     return post_json(u,d)
}

const get_history=async()=>{
      let u=DB_HOST+`/test/_find`
      //let d={ "selector": { "_id": {"$gt": "100"} }, }
      let d={
          "selector": {
              "code": {"$eq": 200}
          },
          "limit": 300,
      }
      let r=await post_json(u,d)
      let r1=r.body
        .docs
        .filter(x=>x.code==200)
      return r1
}

module.exports={
    get_history,
}
