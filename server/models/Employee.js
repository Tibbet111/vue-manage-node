//员工模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{type:String},
    sex:{type:String},
    age:{type:Number},
    department:{type:mongoose.SchemaTypes.ObjectId,ref:'Department'},
    entrytime:{type:Date},
    phone:{type:String}
})

module.exports = mongoose.model('Employee', schema)