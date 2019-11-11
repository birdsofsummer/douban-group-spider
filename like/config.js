const R=require("ramda")
const PREFIX="https://www.douban.com/group/topic/"

const like_url_gen=(tid="147603007")=>PREFIX+tid+ "/?type=like#sep"
const reply_url_gen=(tid)=>PREFIX+tid

const url2id=(url="")=>url.replace(/.*people/,'').replace(/\//g,'')

const get_uid= R.pipe(R.map(R.prop('uid')),R.uniq)

const reply_page_gen=(page_id="123",total=1,)=>R.range(0,total)
        .map(x=>x*100)
        .map(x=>PREFIX+ page_id +"/?start="+ x )
const doulie_url=(topic=86061407)=>{
      `https://m.douban.com/rexxar/api/v2/group/topic/${topic}/collections?start=0&count=20`
    }

module.exports={
    like_url_gen,
    reply_url_gen,
    reply_page_gen,
    PREFIX,
    url2id,
    get_uid,
    DB_HOST:"http://root:q@127.0.0.1:5984",
}


