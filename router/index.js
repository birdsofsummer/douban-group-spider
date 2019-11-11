const superagent=require("superagent")
const fs = require('fs')
const path = require('path')
const {keys,values}=Object
const {URL} = require('url');
const {
    to_json
}=require("../fp")

const e0={
	"headerParameters": {},
	"headers": {
		"accept": "*/*",
		"endpoint-timeout": "15",
		"host": "service-9rx17sto-1252957949.ap-hongkong.apigateway.myqcloud.com",
		"user-agent": "curl/7.61.1",
		"x-anonymous-consumer": "true",
		"x-qualifier": "$LATEST"
	},
	"httpMethod": "GET",
	"path": "/douban",
	"pathParameters": {},
	"queryString": {
	},
	"queryStringParameters": {},
	"requestContext": {
		"httpMethod": "ANY",
		"identity": {},
		"path": "/douban",
		"serviceId": "service-9rx17sto",
		"sourceIp": "58.60.1.28",
		"stage": "release"
	}
}


const msg={
	"Message": "{\n\t\"headerParameters\": {},\n\t\"headers\": {\n\t\t\"accept\": \"*/*\",\n\t\t\"endpoint-timeout\": \"15\",\n\t\t\"host\": \"service-9rx17sto-1252957949.ap-hongkong.apigateway.myqcloud.com\",\n\t\t\"user-agent\": \"curl/7.61.1\",\n\t\t\"x-anonymous-consumer\": \"true\",\n\t\t\"x-qualifier\": \"$LATEST\"\n\t},\n\t\"httpMethod\": \"GET\",\n\t\"path\": \"/douban\",\n\t\"pathParameters\": {},\n\t\"queryString\": {\n\t},\n\t\"queryStringParameters\": {},\n\t\"requestContext\": {\n\t\t\"httpMethod\": \"ANY\",\n\t\t\"identity\": {},\n\t\t\"path\": \"/douban\",\n\t\t\"serviceId\": \"service-9rx17sto\",\n\t\t\"sourceIp\": \"58.60.1.28\",\n\t\t\"stage\": \"release\"\n\t}\n}\n\n",
	"Time": "2019-07-30T01:01:00Z",
	"TriggerName": "cos",
	"Type": "Timer"
}

const cors_headers={
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
    'access-control-allow-headers': 'accept,accept-encoding,cf-connecting-ip,cf-ipcountry,cf-ray,cf-visitor,connection,content-length,content-type,host,user-agent,x-forwarded-proto,x-real-ip,accept-charset,accept-language,accept-datetime,authorization,cache-control,date,if-match,if-modified-since,if-none-match,if-range,if-unmodified-since,max-forwards,pragma,range,te,upgrade,upgrade-insecure-requests,x-requested-with,chrome-proxy,purpose,accept,accept-language,content-language,content-type,dpr,downlink,save-data,viewport-width,width',
    'access-control-max-age': '1728000',
}


const res_html=(name="./index.html")=> ({
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: fs.readFileSync(path.resolve(__dirname, name), { encoding: 'utf-8' }),
})

const res_json=(d={})=>({
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {"Content-Type":"application/json; charset=utf-8",...cors_headers},
    "body": JSON.stringify({"errorCode":0,"errorMessage":"",ok:true,data:d},null,"\t")
})


const echo=(...e)=>({
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {"Content-Type":"application/json; charset=utf-8",...cors_headers},
    "body": JSON.stringify({"errorCode":0,"errorMessage":"",ok:true,data:e},null,"\t")
})

let cookie="pgv_pvid=8655516800; pgv_pvi=6771314688; pgv_info=ssid=s4931415220; pgv_si=s2344184832"

const ajax=(method,url,data=null)=>{
     let m=method.toLowerCase()
     let {host,origin,hostname}=new URL(url)
     let r=superagent[m](url,data)
        .set("referer",origin)
        .set("host",host)
        .set("User-Agent","Mozilla/5.0 (X11; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0")
 //     .set("Cookie",cookie)

     console.log(r)
     return r
}

const proxy=async ({body,headers,httpMethod,queryString:{url}, path})=>{
     let r=await ajax(httpMethod,url)
     console.log(r)
     let {text,body:body1,statusCode,headers:h}=r
     let c=h['content-type']
     const isBase64Encoded =/image/.test(c)  //|audio|video
     let b= isBase64Encoded ? body1.toString("base64") : text||body1.toString("utf-8");
     return {
       //  ...r,
         "body":b,
         isBase64Encoded,
         statusCode,
         headers:{
             "content-type":c,
         },
     }
}

class Router{
    constructor(prefix){
        this.json=res_json
        this.html=res_html
        this.echo=echo
        this.cors_headers=cors_headers
        this.prefix=prefix||""
        this.plugins=[]
        this.router={
            "PUT":{
                "/proxy":proxy,
                "/echo":echo,
            },
            "GET":{
                "/proxy":proxy,
                "/echo":echo,
            },
            "POST":{
                "/proxy":proxy,
                "/echo":echo,
            },
            "DELETE":{
                "/proxy":proxy,
                "/echo":echo,
            },
        }
    }
    prefix(x){
        this.prefix=x
    }
    use(f){
        this.plugins.push(f)
    }
    post(path,cb){
        this.router.POST[path]=cb
    }
    put(path,cb){
        this.router.PUT[path]=cb
    }
    get(path,cb){
        this.router.GET[path]=cb
    }
    delete(path,cb){
        this.router.DELETE[path]=cb
    }
    async run(e=e0, context, callback){
        let event= e.Message ? to_json(e.Message) : e
        console.log('zzzz',event)
        let {body,headers,httpMethod,queryString, path}=event
        let prefix=this.prefix
        let router=this.router;
        let mm=router[httpMethod]
        console.log({router,prefix,httpMethod,mm})
        let pset= new Set(keys(mm))
        let p=path.replace(prefix,"") || "/"
        let p1=pset.has(p) ?  p : "/"
        let fn=mm[p1] || echo
        return await fn(event, context, callback)
    }
}

//f=(context,next)=>{...;next()}
const compose=([h,...t])=>ctx=>{
    if (!h) { return ; }
    h(ctx,()=>compose(t)(ctx))
}


// curl "https://service-9rx17sto-1252957949.ap-hongkong.apigateway.myqcloud.com/release/douban/proxy?url=http%3A%2F%2Fws.stream.qqmusic.qq.com%2FC400000z6RLz2OWlRY.m4a%3Ffromtag%3D0guid%3D126548448%26vkey%3D4336E3B49853B67BA80715F2B47B1797046C74C179D3E3AD2A743C05DA2C3F9F88D5963008BCBC8A7D146E19E9F39BA15DF7FCCD5726D7F4"
const TEST_MUSIC="http://ws.stream.qqmusic.qq.com/C400000z6RLz2OWlRY.m4a?fromtag=0&guid=126548448&vkey=4336E3B49853B67BA80715F2B47B1797046C74C179D3E3AD2A743C05DA2C3F9F88D5963008BCBC8A7D146E19E9F39BA15DF7FCCD5726D7F4"

const test=async (url=TEST_MUSIC)=>{
    let e={
	"headerParameters": {},
	"headers": {
		"accept": "*/*",
		"endpoint-timeout": "15",
		"host": "service-9rx17sto-1252957949.ap-hongkong.apigateway.myqcloud.com",
		"user-agent": "curl/7.61.1",
		"x-anonymous-consumer": "true",
		"x-qualifier": "$LATEST"
	},
	"httpMethod": "GET",
	"path": "/douban/proxy",
	"pathParameters": {},
	"queryString": {
		url
	},
	"queryStringParameters": {},
	"requestContext": {
		"httpMethod": "ANY",
		"identity": {},
		"path": "/douban",
		"serviceId": "service-9rx17sto",
		"sourceIp": "58.60.1.28",
		"stage": "release"
	}
}
   let r=new Router("/douban")
   d=await r.run(e)
   console.log(d)
    return d
}



const download=(url=TEST_MUSIC,file_name='./1.aac')=>{
    stream = fs.createWriteStream(file_name)
    ajax("get",url).pipe(stream)
}

module.exports = {Router,compose,test,download}

