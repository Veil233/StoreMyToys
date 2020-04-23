const http=require('http')
const mysql=require('mysql')
const queryString=require('querystring')

const connection=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '990114',
    database : 'cardinfo'
})

connection.connect()

http.createServer(function (req , res) {
    var body=''
    res.setHeader(   'Access-Control-Allow-Origin' , 'http://localhost:63342')
    res.setHeader(   'Access-Control-Allow-Headers' , 'content-type , x-ijt')/*x-ijt是必须的*/
    res.setHeader(   'Access-Control-Allow-Method' , 'GET , POST')
    res.writeHead(200,{'Content-Type' : 'text/plain ; charset=utf-8',})
    req.on('data' , function (chunk) {
        body+=chunk
    })
    req.on('end' , function () {
        body=queryString.parse(body)
        console.log(body.number)
        const now=new Date()
        const timeStamp=now.toLocaleDateString()+now.toLocaleTimeString()
        const sql=`insert into card (number , brand , holder , ccv , applydate , expiration , timestamp) values (? , ? , ? , ? , ? , ? , ?)`
        const sqlParams=[body.number , body.brand , body.holder , body.ccv , body.applyDate , body.expiration ,timeStamp]
        console.log("params : " + sqlParams)
        connection.query(sql , sqlParams , function (err , result) {
            if (err)    console.log("err : "+err)
            else res.write("success")
            res.end()
        })
    })
}).listen(8080)
