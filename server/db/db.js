module.exports = app=>{
    const mongoose = require('mongoose')
    mongoose.set('useFindAndModify', false)
    mongoose.connect('mongodb://localhost/vue-manage',{useNewUrlParser: true,useUnifiedTopology: true})
}