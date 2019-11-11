const R=require("ramda")
const cheerio = require('cheerio');
const {
    url2id,
    get_uid,
}=require("./config")


const parser=(r)=>{
    let $ = cheerio.load(r);
    let li=".topic-fav-list li"
    let d=$(li)
    let author_dom=$(".topic-content .user-face")
    let ahead=author_dom.find('a img')
    let aurl= author_dom.find('a').attr('href')
    const author={
        head:ahead.attr('src'),
        name:ahead.attr('alt')||"",
        url:aurl,
        uid:url2id(aurl),
    }
    let k=[author]
    for (let i=0;i<d.length;i++){
         let ii=d.eq(i)
         let head=ii.find('.pic img').attr('src')
         let name=ii.find('.content a').text()
         let url=ii.find('.content a').attr('href')
         let uid=url2id(url)
         let person={ head,name,url,uid }
         k.push(person)
    }
    return k
}
const like_uid_parser= R.pipe(parser,get_uid)

module.exports={
    parser,
    like_uid_parser,
}
