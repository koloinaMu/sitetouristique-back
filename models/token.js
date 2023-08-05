const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema( { 
    token: String,
    //fileId: [] //mongoose.Schema.Types.ObjectId
});

module.exports=mongoose.model('Token', tokenSchema);