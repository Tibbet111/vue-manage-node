//员工模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{type:String},
    sex:{type:String},
    age:{type:Number},
    department:{type:String},
    entrytime:{type:Date},
    phone:{type:String}
})

module.exports = mongoose.model('Employee', schema)