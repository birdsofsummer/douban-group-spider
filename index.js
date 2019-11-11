const { parser, }=require("./parser")
const { gets1, gets2, get_cache, get_and_cache, } =require("./douban")
const app=async (e, context, callback) => {
        const {Router} = require("./router")
        let r=new Router("/douban")
        r.get("/",async()=>r.json(await get_and_cache()))
        r.get("/echo",async(e, context, callback)=>r.json(e))
        r.post("/parse",async({body,headers,httpMethod,queryString:{url}, path}, context, callback)=>r.json(parser(body)))
        r.get("/cache",async()=>{
            let z=await get_cache()
            return r.json(z.body)
        })
        return await r.run(e, context, callback)
};
exports.main_handler =app
