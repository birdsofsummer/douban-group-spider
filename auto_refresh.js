const {get_and_cache} =require("./douban")
const run=()=>{
     let s= setInterval ( get_and_cache,60*1000 )
     return s
}

//let d=run()
get_and_cache().then(console.log)
