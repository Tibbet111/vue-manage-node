//登录用户模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    name:{type:String},
    role:{type:String},
    avatar:{type:String},
    status:{type:Boolean}
})

module.exports = mongoose.model('AdminUser', schema)