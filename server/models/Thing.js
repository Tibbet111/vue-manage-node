//消息模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{type:String},
    userId:{type:mongoose.SchemaTypes.ObjectId,ref:'AdminUser'}
})

module.exports = mongoose.model('Thing', schema)