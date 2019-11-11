const R=require("ramda")
const {cos_url,host}=process.env
const { get, gets, get_json, superagent, }=require("./ajax")

const GROUPS=[
            "259104",
            "49635",
            "ereading",
           //"blabla", //鹅
           //"gua",    //瓜
        ]

const {
    parser1,
    group_info_parser,
}=require("./parser")

const { read } =require("./db1")


const groups_fullname=(groups=GROUPS)=>groups.map(x=>`https://www.douban.com/group/${x}/discussion?start=`)
const url_formater=(x)=>(i=0)=>`${host}/${x}/discussion?start=`+i*25

const urls_gen=(groups=GROUPS,[a,b]=[0,10])=>groups
    .map(
        x=>R.range(a,b)
            .map(url_formater(x))
    )


const res_handler=(parser)=>(y)=>({
    info:group_info_parser(y[0].text),
    data:R.flatten(y.map(x=>x.text).map(parser))
})

const gets1=async(groups=GROUPS,n=10)=>{
    const r=await gets(urls_gen(groups)[0])
    const black_list=await read()
    const parser=parser1(black_list)
    return res_handler(parser)(r)
}

const gets2=async (groups=GROUPS,[a,b]=[0,10])=>{
    const us=urls_gen(groups,[a,b])
    let r=await Promise.all(us.map(gets))
    //const black_list=await read()
    const black_list=[[],[]]
    const parser=parser1(black_list)
    return r.map(res_handler(parser))
}

//gets2().then(console.log)

const get_cache=()=>get_json(cos_url)

const get_and_cache=async (groups=GROUPS)=>{
    const {upload_s}=require("./cos")
    let d=await gets2(groups,[0,2])||[]
     d.length && (await upload_s(d))
    return d
}

module.exports={
    gets1,
    gets2,
    get_cache,
    get_and_cache,
}
