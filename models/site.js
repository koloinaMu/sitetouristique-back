const mongoose = require('mongoose');
const Media=require('./media');

const siteSchema = mongoose.Schema( { 
    nom: String,
    description: String,
    region: String,
    imagePosteur: String,
    media:[{
        urlMedia:String,
        descriptionMedia:String,
        urlVideo:String
    }]
});

module.exports=mongoose.model('site', siteSchema);