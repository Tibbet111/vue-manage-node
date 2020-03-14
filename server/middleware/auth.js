module.exports = options =>{
    const jwt = require('jsonwebtoken')
    const adminUser = require('../models/AdminUser')

    return async (req,res,next)=>{
        //校验用户是否登录
         const token = String(req.headers.authorization || '').split(' ').pop()
         if(!token){
          res.status(401).send({message:"请先登录"})
        }
         const {id } =  jwt.verify(token,req.app.get('secret'))
         if(!id){
          res.status(401).send({message:"请先登录"})
        }
         req.user = await adminUser.findById(id)
         if(!req.user){
          res.status(401).send({message:"请先登录"})
        }
        await next()
      }
}