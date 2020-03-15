const express = require('express')


const app = express()
 
//跨域
app.use(require('cors')())
//使用json
app.use(express.json())
//数据库链接
require('./db/db')(app)
//路由
require('./routes/router')(app)
//token的密匙
app.set('secret','tibbet')
//使用静态资源文件
app.use('/uploads',express.static(__dirname + '/uploads'))

app.listen(3000,()=>{
    console.log("http://localhost:3000");
})