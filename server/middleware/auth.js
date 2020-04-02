module.exports = options =>{
    const jwt = require('jsonwebtoken')
    const adminUser = require('../models/AdminUser')

    return async (req,res,next)=>{
        //校验用户是否登录
         const token = String(req.headers.authorization || '').split(' ').pop()
         if(!token){
          res.status(401).send({message:"请先登录"})
        }
        jwt.verify(token,req.app.get('secret'),async (err,decoded)=>{
          if(err){
            res.status(411).send({message:"登录失效，请重新登录"})
            return
          }
          const {id } =  decoded
          if(!id){
           res.status(401).send({message:"请先登录"})
         }
          req.user = await adminUser.findById(id)
          if(!req.user){
           res.status(401).send({message:"请先登录"})
         }
        })       
        await next()
      }
}