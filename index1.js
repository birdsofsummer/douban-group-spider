const sep=(t="-")=>console.log(t.repeat(80)+"\n")
const echo=(e={})=>({
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: JSON.stringify(e)
})

const echo_app = async (e, context, callback) => {
    /*
        /var/lang/node8/bin/node
        /var/user
    */

        sep()
        console.log(process.execPath)
        console.log(__dirname)
        console.log(process.cwd())
        sep()
        console.log(e);
        sep()
        console.log(process.env)
        sep()
        const x=require("./ttt")
        console.log("x=",x)
        sep()
        return echo(e)
}
exports.main_handler =echo_app
