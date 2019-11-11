const R=require("ramda")

const promisify_all=(c)=>{
    const {promisify}=require('util')
    R.mapObjIndexed((v,k,o)=>o.__proto__["_"+k]=promisify(v.bind(c)))(c.__proto__)
    return c
}

const rnd=(n=1)=>Math.floor(Math.random()*n)
const uniq=(...arg)=>[...arg.reduce((a,b)=>(b.map(x=>a.add(x)),a),new Set())];
const arr2reg=(arr)=>new RegExp(arr.join("|"),"i");

const json2s=(a="=",b=" ;")=>(c={})=>R.values(R.mapObjIndexed((v,k)=>k+a+v)(c)).join(b)

const json2cookie=(c={})=>R.values(R.mapObjIndexed((v,k)=>k+"="+v)(c)).join("; ")


const is_s=(s="")=>s.constructor == String
const is_o=(s="")=>R.isNil(s) ? false : s.constructor == Object
const is_arr=Array.isArray

const to_json=(a)=>{
    if (R.isNil(a)) return {}
    if (is_o(a)){ return a}
    try{
       return JSON.parse(a)
    }catch(e){
        return {}

    }
}

function rainbow(arr=[]){
   let index=0
   let l=arr.length
   function* foo() {
      while (true) {
          let i= index <l ? index++ : 0
          yield arr[i];
      }
    }
    iterator = foo()
    return ()=>iterator.next().value
}

function* shuffle(arr=[]) {
    let l=arr.length
    while (true) {
          yield arr[rnd(l)];
    }
}

const rand_word=(n=1)=>{
    let dict=R.range(65,65+62)
        .map(x=>String.fromCharCode(x))
        .filter(x=>/[a-zA-Z]/.test(x))
    let z=shuffle(dict)
    return R.repeat(1,n).map(x=>z.next().value).join('')
}

const rand_number=(n=1)=>{
    let z=shuffle(R.range(0,10))
    return R.repeat(1,n).map(x=>z.next().value).join('')
}
const diff=R.pipe(R.difference,R.uniq)

module.exports={
    uniq,
    arr2reg,
    json2cookie,
    is_s,
    is_o,
    is_arr,
    to_json,
    rainbow,
    rand_number,
    rand_word,
    diff,
    promisify_all,
}

