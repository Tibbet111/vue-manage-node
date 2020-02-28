//消息模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{type:String}
})

module.exports = mongoose.model('Thing', schema)