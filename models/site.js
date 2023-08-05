const mongoose = require('mongoose');

const siteSchema = mongoose.Schema( { 
    nom: String,
    description: String,
    region: String,
    imagePosteur: String,
    media:[]
});

module.exports=mongoose.model('Site', siteSchema);