const black=async()=>{
     const prefix="https://ttt-1252957949.cos.ap-hongkong.myqcloud.com/douban/"
     const  u=["black_list","black_id_list"]
     const u1=u.map(x=> prefix+x+".json")
     const {get_jsons} =require("../ajax")
     let r1=await get_jsons(u1)
     let r2=r1.map(x=>x.body)
     return r2
}
module.exports={
    black,
}
