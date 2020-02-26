module.exports = app=>{
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://localhost/vue-manage',{useNewUrlParser: true,useUnifiedTopology: true})
}