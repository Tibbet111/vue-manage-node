//已读消息模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId : {type:mongoose.SchemaTypes.ObjectId,ref:'AdminUser'},
    messageId : {type:mongoose.SchemaTypes.ObjectId,ref:'Message'}
})

module.exports = mongoose.model('ReadMessage', schema)