const R=require("ramda")

const {get,gets} =require("../ajax")
const {
    like_url_gen,
    reply_url_gen,
}=require("./config")
const {
    like_uid_parser,
    parser,
}=require("./parser")

const {
    comment_parser,
    doulie_parser,
    zan_parser,
    uid_parser,
}=require("./reply_parser")


const zan_spider=async (tid="147603007")=>{
    let u=like_url_gen(tid)
    let r=await get(u)
    let t=r.text
    return parser(t)
}

const people_spider=async (tid=["147626136"])=>{
    let u=tid.map(reply_url_gen)
    let r=await gets(u)
    return R.flatten(R.flatten(r.map(x=>x.text)).map(uid_parser)).sort()
}

module.exports={
    zan_spider,
    people_spider,
}

