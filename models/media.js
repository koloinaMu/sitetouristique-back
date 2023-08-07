const mongoose = require('mongoose');

const siteSchema = mongoose.Schema( { 
    urlMedia:String,
    descriptionMedia:String,
    urlVideo:String
});

module.exports=siteSchema;