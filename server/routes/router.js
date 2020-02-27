module.exports = app =>{
    const express = require('express')
    const assert = require('http-assert')
    const adminUser = require('../models/AdminUser')
    const router = express.Router({mergeParams:true})
    const jwt = require('jsonwebtoken')

    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
      });
      //错误处理函数
   app.use(async (err,req,res,next)=>{
    res.status(err.statusCode || 500).send({
       message:err.message
    })
 })
 
    //验证登录
    app.post('/api/login',async (req,res)=>{
        const {username,password} = req.body
        //根据用户名在数据库找出该用户
        const user = await  adminUser.findOne({username}).select('+password')
        //如果该用户不存在返回422报错
        if(!user){
            res.status(422).send({message:"用户名不存在"})
        }
        //用户存在则校验密码
        const isValid = require('bcrypt').compareSync(password,user.password)
        //如果密码不正确返回422报错
       if(!isValid){
           res.status(422).send({message:"密码错误"})
       }
        //全部正确则返回前端一个token和菜单
        const token = jwt.sign({id:user._id},app.get('secret'))
        let path = null
        if(user.role == 'admin'){
            path = [
                {
                  icon:'el-icon-edit-outline',
                  index:'editmessage',
                  title:'发布消息'
                },
                {
                  icon:'el-icon-s-custom',
                  index:'userinfo',
                  title:'编辑用户信息'
                },
                {
                  icon:'el-icon-search',
                  index:'user',
                  title:'查询用户信息'
                },
                {
                  icon:'el-icon-user-solid',
                  index:'role',
                  title:'编辑权限信息'
                }
              ]
        }else{
            path = [
                {
                  icon:'el-icon-search',
                  index:'user',
                  title:'查询用户信息'
                }
              ]
        }
        res.send({token,user,path})
    });

    //登录校验中间件
    const authMiddleware = require('../middleware/auth')
    //资源中渐渐
    const resourceMiddleware = require('../middleware/resource')
    //通用增删改查接口
    app.use('/api/v2/:resource',authMiddleware(),resourceMiddleware(),router)

    //获取数据
    router.get('/',async (req,res)=>{
      const items = await req.Model.find()
      res.send(items)
    })
    //创建数据
    router.post('/',async (req,res)=>{
      const items = await req.Model.create(req.body)
      res.send(items)
    })
    //修改数据
    router.put('/:id',async (req,res)=>{
      const items = await req.Model.findByIdAndUpdate(req.params.id,req.body)
      res.send(items)
    })
    //删除数据
    router.delete('/:id',async (req,res)=>{
      await req.Model.findByIdAndDelete(req.params.id,req.body)
      res.send({
        success:true,
        msg:'删除成功'
      })
    })
}