//员工模型
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{type:String},
    owner:{type:mongoose.SchemaTypes.ObjectId,ref:'Employee'}
})

module.exports = mongoose.model('Department', schema)