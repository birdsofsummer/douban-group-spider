var COS = require('cos-nodejs-sdk-v5');
const R=require("ramda")

const {promisify_all}=require("../fp")
const cos_cfg = R.pickAll(["SecretId", "SecretKey", "Bucket", "Region", "Prefix",], process.env)

const cos =promisify_all( new COS(cos_cfg))
const upload=(Key="./cos.js",fn)=>cos.multipartUpload({ ...cos_cfg, Key, },fn)
const upload1=(Key="./cos.js")=>cos._multipartUpload({ ...cos_cfg, Key, })

const upload_s=( Body={}, Key="/douban/douban.json", )=>cos._putObject({
    ...cos_cfg,
    Key,
    Body:JSON.stringify(Body),
})

const upload_black=async ()=>{
    const { read } =require("../db1")
    const [ black_list,black_id_list]=await read()
    let d=[
        [black_list,"/douban/black_list.json"],
        [black_id_list,"/douban/black_id_list.json"],
    ]
    return Promise.all(d.map(([v,k])=>upload_s(v,k)))
}
const list=()=>cos._getBucket(cos_cfg)

module.exports={
    cos,
    upload1,
    list,
    upload_s,
    upload_black,
}
