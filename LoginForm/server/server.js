var http=require('http')
var queryString=require('querystring')
var mysql=require('mysql')


var connection=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '990114',
    database : 'userinfo'
})

connection.connect(function (err) {
    if (err)    console.log("connect to mysql error : "+err)
})

/**
 *对数据库进行操作
 * @param res  server response
 * @param option 对数据库的操作
 * @param sql sql语句、预处理语句或者比对的数据
 */
function operateMySql( res , option , ...sql  ){
    //注册 将数据存入数据库
    if (option=="save"){
        connection.query(sql [0], sql[1] ,function (err  , result) {
            if (err) {
                console.log(err)
                res.write("failed")
            }
            else {
                console.log("sign up successfully : "+result)
                res.write("success")
            }
            res.end()
        })
    }
    //登录 从数据库读取数据比对
    else if (option=="query"){
        connection.query(sql[0] , function (err , result) {
            if (err) {
                console.log(err)
                res.write("failed")
            }
            else if (result [0].password == sql[1]) {//result返回的是包含RowDataPacket对象的数组
                console.log("login successfully")
                res.write("success")
            }
            else res.write("failed")
            res.end()
        })
    }
    //自动登录，查找数据库中是否有该username
    else if (option=="find"){
        connection.query(sql[0] , function (err , result) {
            if (err) {
                console.log(err)
                res.write("failed")
            }
            if (result==undefined) res.write("failed")
            else {
                res.write("success")
                console.log("find user :"+result)
            }
            res.end()
        })
    }
}


http.createServer( function ( req , res ) {
    var body=""
    res.setHeader("Access-Control-Allow-Origin" , "*")//允许跨域
    /*res.setHeader("Access-Control-Allow-Headers" , "Content-Type , Content-Length , Authorization , Accept , X-Requested-With , yourHeaderField")
    res.setHeader("Access-Control-Allow-Methods" , "PUT , POST , GET , DELETE , OPTIONS")*/
    req.on( 'data' , function (chunk) {
        body+=chunk
    })
    req.on( 'end' , function () {
        body=queryString.parse(body)
        console.log(`request from : ${req.url}`)
        res.writeHead(200 , {'Content-Type' : 'text/html ; charset=utf-8'} )
        //注册操作
        if (req.url=="/signUp"){
            var sql='insert into user(id , name , password , phone , email , sign_time) values ( ? , ? , ? , ?  , ? , ? )'//预处理，插入数据集
            var sqlId='select count (*) as count from user'//读取数据库现有数据,结果为rowPacket对象，key为count（0），可以用as给他起个别名
            var time=new Date().toLocaleString()
            connection.query(sqlId , function (err , result) {
                if (err) console.log(err)
                var id=result[0].count+1
                var sqlParams=[id , body.username , body.password , body.phone , body.email , time]
                console.log("query : "+sql+"\n"+sqlParams)
                operateMySql( res ,"save" , sql , sqlParams )
            })
        }
        //登录操作
        else if (req.url=="/login"){
            var sql=`select password from user where ${body.type}='${body.username}'`//查询字段需要单引号
            console.log("query : "+sql)
            operateMySql( res ,"query" , sql , body.password )
        }
        //本地存有用户登录信息，自动登录操作
        else if (req.url=="/autoLogin"){
            var sql=`select id from user where ${body.type}='${body.username}'`
            console.log("query : "+sql)
            operateMySql( res ,"find" , sql)
        }
    })
}).listen(8080)

