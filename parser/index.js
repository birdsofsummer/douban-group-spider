const R=require("ramda")
const cheerio = require('cheerio');

const { arr2reg, }=require("../fp")


const wash=(r1)=>R.map(x=>[x.length,x.map(y=>R.values(y).join("_"))],R.groupBy(x=>/李现|陈情|肖|杨紫|嬛/.test(x.title)? "水": "o",r1))

const wash1=(items,black_list)=>{
    let re=arr2reg(black_list)
    return items.map(
         y=>y
        .filter(x=>!re.test(x.title))
        .sort((b,a)=>a.hit-b.hit)
    )
}


const format_data=([{href:url,title:tt},title,{href:author_u},author,,hit,,time,])=>({time,url,title:tt,author_u,author,hit})


const save=(name="1.json",r1={})=>{
    fs=require('fs')
    j=fs.createWriteStream(name)
    j.write(JSON.stringify(r1,null,"\t"))
 //   j.close()
}


const group_list_parser=(r)=>{
    let $ = cheerio.load(r);
}

const group_info_parser=(r)=>{
    let $ = cheerio.load(r);
    title= $('#g-side-info .title a').text()
    img  = $('#g-side-info img').attr('src')
    return {title,img}
}

const parser1=([black_list,black_id_list]=[[],[]])=>(r)=>{
     let $ = cheerio.load(r);
     let k=[]
     $(".olt tr").slice(1,26).each(function(i){
         let td=$(this).find("td");
         let d=[]
         td.each(function(j){
              let li=$(this).text().trim()
              let link=$(this).find('a')
              let href=link.attr('href')
              let title=link.attr('title')
              link && d.push({href,title})
              d.push(li)
         })
         let d1=format_data(d)
         k.push(d1)
     })
    let re=arr2reg(black_list)
    return k
       // .filter(x=>!re.test(x.title))
       // .filter(x=>!black_list.some(b=>new RegExp(b,"i").test(x.author)))
        .filter(x=>!black_list.some(b=>new RegExp(b,"i").test(x.title)))
        .filter(x=>!black_id_list.some(b=>new RegExp(b,"i").test(x.author_u)))
        .sort((b,a)=>a.hit-b.hit)
}

//const res_handler=(y)=>y.map(x=>x.text).map(parser).flat()

module.exports={
    parser1,
    group_info_parser,
}
