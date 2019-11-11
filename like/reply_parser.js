const R=require("ramda")
const cheerio = require('cheerio');

const {
    url2id,
    get_uid,
    reply_page_gen,
}=require("./config")

const map=(fn)=>dom=>{
    let k=[];
    for (let i=0;i<dom.length;i++){
        k.push(fn(dom.eq(i)))
    }
    return k
}

const parse_person=(a_dom)=>{
    aurl=a_dom.find('a').attr('href')
    ahead= a_dom.find('a img').attr('src')
    aname=a_dom.find('a img').attr('alt')
    return {
        url:aurl,
        uid:url2id(aurl),
        name:aname,
        head:ahead,
    }
}

const zan_parser=(r)=>{
    let $ = cheerio.load(r);
    let k=[]
    let people=$('a[href*="people"]')
    let l= people.length
    for (let i=0;i<l;i++){
        let person= people.eq(i)
        let img=person.find('img')

        let head=img.attr('src')
        let name=img.attr('alt')

        let url=person.attr('href')
        let d={
            head,
            name,
            url,
            uid:url2id(url),
        }
        k.push(d)
    }
    return k.filter(x=>x.name);
}

const uid_parser= R.pipe(zan_parser,get_uid,R.uniq)

const comment_parser=(r)=>{
    let $ = cheerio.load(r);
    let a_dom=$('.topic-content .user-face')
    let author=parse_person(a_dom)
    const parse_li=(p)=>{
            let head=p.find('.user-face a img').attr('src')
            let name=p.find('.user-face a img').attr('alt')
            let url=p.find('.user-face a').attr('href')
            let uid=url2id(url)
            let user={uid,url,name,head}
            let time=p.find('.reply-doc .pubtime').text()
            let content=p.find('.reply-doc .reply-content').text()
            let cid=p.attr('id')
            let c_url=p.find('.reply-doc .lnk-reply').attr('href')
            return{ cid, time, content, user, }
    }
    let popular=$('.popular-bd li')
    let zan=map(parse_li)(popular);
    let reply=map(parse_li)($('#comments li'))

    let title=$('h1').text().replace("\n","").trim()
    let total_page=$('.thispage').data('total-page') || 1
    let page_id= $('#sep a').eq(1).attr('href').match(/\d+/)[0]
    let this_page =+$('.thispage').text() || 1
    //map(x=>x.attr('href'))($(".paginator >a"))
    let pages= reply_page_gen(page_id,total_page)
    return {
        title,
        author,
        zan,
        reply,
        total_page,
        this_page,
        pages,
    }
}


const doulie_parser=(r)=>{
    let $ = cheerio.load(r);
    return map(parse_person)($('.collect-list li'))
}

module.exports={
    comment_parser,
    doulie_parser,
    zan_parser,
    uid_parser,

}
