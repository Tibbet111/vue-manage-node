module.exports = app =>{
    const express = require('express')
    const adminUser = require('../models/AdminUser')
    const router = express.Router({mergeParams:true})
    const jwt = require('jsonwebtoken')
    const svgCaptcha = require('svg-captcha');  //验证码
  

    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
      });
      //错误处理函数
   app.use(async (err,req,res,next)=>{
    res.status(err.statusCode || 500).send({
       message:err.message || '发生错误'
    })
 })
    //获取验证码
    app.get('/api/captcha',(req,res)=>{
      const cap = svgCaptcha.create({
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 1, // 干扰线条的数量
        color: true ,// 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#' + Math.random().toString(16).substr(2, 6).toUpperCase(), // 验证码图片背景颜色
      })
      res.type('svg'),
      res.send({img:cap.data,text:cap.text.toLowerCase()})
    })

    //注册
    app.post('/api/register',async (req,res)=>{
      const username = req.body.username
      const isExist = await adminUser.findOne({username})
      if(isExist){
        res.status(422).send({message:"该用户已经存在"})
        return
      }
       const items = await adminUser.create(req.body)
       res.send(items)
    })

 
    //验证登录
    app.post('/api/login',async (req,res)=>{
        const {username,password} = req.body
        //根据用户名在数据库找出该用户
        const user = await  adminUser.findOne({username}).select('+password')
        //如果该用户不存在返回422报错
        if(!user){
            res.status(422).send({message:"用户名不存在"})
            return
        }
        //用户存在则校验密码
        const isValid = require('bcrypt').compareSync(password,user.password)
        //如果密码不正确返回422报错
       if(!isValid){
           res.status(422).send({message:"密码错误"})
           return
       }
       //如果当前用户没激活不让登陆
       if(!user.status){
        res.status(422).send({message:"当前用户没有激活"})
        return
      }
        //全部正确则返回前端一个token和菜单
        const token = jwt.sign({id:user._id},app.get('secret'),{ expiresIn: '1h' })
        let path = null
        if(user.role == 'admin'){
            path = [
              {
                icon:'el-icon-message',
                index:'tabs',
                title:'消息'
              },
                {
                  icon:'el-icon-edit-outline',
                  index:'editmessage',
                  title:'发布消息'
                },
                {
                  icon:'el-icon-s-custom',
                  index:'userinfo',
                  title:'编辑员工信息'
                },
                {
                  icon:'el-icon-search',
                  index:'user',
                  title:'查询员工信息'
                },
                {
                  icon:'el-icon-user-solid',
                  index:'role',
                  title:'编辑权限信息'
                },
                {
                  icon:'el-icon-coordinate',
                  index:'department',
                  title:'编辑部门信息'
                },
                {
                  icon:'el-icon-edit',
                  index:'editroleinfo',
                  title:'修改个人信息'
                }
              ]
        }else{
            path = [
              {
                icon:'el-icon-message',
                index:'tabs',
                title:'消息'
              },
              {
                icon:'el-icon-search',
                index:'user',
                title:'查询员工信息'
              },
              {
                icon:'el-icon-edit',
                index:'editroleinfo',
                title:'修改个人信息'
              }
              ]
        }
        res.send({token,user,path})
    });

    //登录校验中间件
    const authMiddleware = require('../middleware/auth')
    //资源中间件
    const resourceMiddleware = require('../middleware/resource')
    //通用增删改查接口
    app.use('/api/v2/:resource',authMiddleware(),resourceMiddleware(),router)

    //获取数据
    router.get('/',async (req,res)=>{
      const queryOptions = {}
       if(req.Model.modelName == 'Department'){
          queryOptions.populate = { path: 'owner', select: 'name' }
       }else if(req.Model.modelName =='Employee'){
          queryOptions.populate = { path: 'department', select: 'name' }
       }
      const items = await req.Model.find().setOptions(queryOptions)
      res.send(items)
    })
     //获取某个详情信息
     router.get('/:id',async(req,res)=>{  
      const model = await req.Model.findById(req.params.id)
      res.send(model)
   }) 
    //创建数据
    router.post('/',async (req,res)=>{
      const items = await req.Model.create(req.body)
      res.send({items,msg:'添加成功'})
    })
    //修改数据
    router.put('/:id',async (req,res)=>{
      const items = await req.Model.findByIdAndUpdate(req.params.id,req.body,{new:true})
      res.send({items,msg:'修改成功'})
    })
    //删除数据
    router.delete('/:id',async (req,res)=>{
      await req.Model.findByIdAndDelete(req.params.id,req.body)
      res.send({
        success:true,
        msg:'删除成功'
      })
    })

    //显示当前用户的待办事项
    app.get('/api/user/things',authMiddleware(),async (req,res)=>{
      const items = await require('../models/Thing').find({userId:req.query.id})
      res.send(items)
    })

    //当前用户个人信息
    app.get('/api/admin/info',authMiddleware(),async (req,res)=>{
      const item = await adminUser.findById(req.query.id)
      res.send(item)
    })

    //消息
    //添加已读消息
    const readMsg = require('../models/ReadMessage')
    app.post('/api/message/readMessage',authMiddleware(),async (req,res)=>{
      const items = await readMsg.create(req.body)
      res.send(items)
    })

    //获取当前用户的已读消息
    app.get('/api/message/msg',authMiddleware(),async (req,res)=>{
      const messages = await readMsg.find({userId:req.query.id},{userId: 0 }).populate('messageId')
      res.send(messages)
    })

    //删除消息
    app.delete('/api/message/delete/:id',authMiddleware(), async(req,res)=>{
      await readMsg.remove({messageId:req.params.id})
      res.send({
        message:'删除成功'
      })
    })

    //接受上传文件
    const multer = require('multer')
    const upload = multer({dest:__dirname + '/../uploads'})
    app.post('/api/upload',authMiddleware(),upload.single('file'),async (req,res)=>{
      const file = req.file
      file.url = `http://localhost:3000/uploads/${file.filename}`
      res.send(file)
    })

    //查询员工
    //分页显示员工
    const employee = require('../models/Employee')  
    app.get('/api/employee/list',async (req,res)=>{
      const {page,limit,value} = req.query
      if(page<1){
        page = 1
      }
      const total  = (await employee.find({
        $or:[
          {name:{'$regex': value, $options: '$i'}},
        ]
      })).length
      const items = await employee.find(
        {$or:[
          {name:{'$regex': value, $options: '$i'}},
        ]
      }).populate('department','name').skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit)).lean()
      res.send({
        total,
        employee:items
      })
    })
    

    //批量删除员工
    app.delete('/api/employee/delete/:id', async (req,res)=>{
      const ids =  req.params.id.split(',')
      await employee.deleteMany({_id:{$in:ids}},(err,doc)=>{
        if(err){
          return res.status(400).send({message:'删除失败'})
        }
        return res.send({
          msg:'删除成功'
        })
      })
    })

      //获取部门所有人
      const department = require('../models/Department')
      app.get('/api/department/owner',async (req,res)=>{
        const {name} = req.query
        const dep = await department.findOne({name})
        const owner = await department.aggregate([
          {$match: {_id:dep._id}},
          {
            $lookup: {     //类似于join以cat为主体查另外一个集合，根据分类_id关联的文章表的外键去查询文章
                from:'employees',     //关联那一个表
                localField:'_id',   //本地键
                foreignField:'department',     //相当于外键，article表中用的关联字段
                as:'owner'   //名字
            },
        },
        {$project:{'owner':1,'_id':0}}
        ])
        res.send(owner)
      })
}