var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var formidable = require('formidable');
const admin=require('../config/firebaseAdmin')
const Site=require('../models/site');
const token = require('../models/token');


async function verifToken(tokens){
    var vals=[]
    for(r in tokens){
        //registrationToken.push(tokens[r].token)
        var tok=(tokens[r].token)
        console.log(tok)
        //tok = tok.split(":")[1];
        //console.log(tok)
        const val=await admin.auth().verifyIdToken(tok)
        //admin.verifyIdToken()
        console.log(val)
        vals.push(tokens[r].token)
    }
    return vals
}

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };
router.post('/firebase/notification',  (req, res)=>{
  //console.log(req)   
      
          token.find({}).then((result)=>{
            //var registrationToken=await verifToken(result);
            verifToken(result).then((ress)=>{
                const registrationToken=ress
                Site.aggregate([{$sample: {size: 1}}])
                .then(site =>{
                    const data={
                        nom:site[0].nom,
                        description:site[0].description,
                        region:site[0].region,
                        files:JSON.stringify(site[0].files)
                    }
                    const message = {        
                        notification: {            
                            title: "Avez-vous deja visite?",            
                            body: site[0].nom        
                        },              
                        data: data  || {}    
                    };
                    const options =  notification_options
                    //console.log(message)
                    console.log(options)
                    console.log(registrationToken)
                    admin.messaging().sendToDevice(registrationToken, message, options)
                    .then( response => {

                        res.status(200).send("Notification sent successfully")
                    
                    })
                })
                .catch(error => res.status(400).json({ error }));
            })
          })        
})


router.get('/formAjoutSite', (req, res) => {
    res.sendFile( __dirname  + '/formAjout.html');
    
})

router.post('/ajoutSite', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log(files)
      res.write('File uploaded');
      res.end();
    });
    
})

router.get('/randomSite',(req,res)=>{
    Site.aggregate([{$sample: {size: 1}}])
        .then(site => res.status(200).json(site))
        .catch(error => res.status(400).json({ error }));
})

router.get('/sites/:nom',function(req,res) {
    const nom=req.params.nom;
    var query={  $or: [ { nom: {$regex: nom, $options: 'i'} }, 
    { description: {$regex: nom, $options: 'i'}}  ] }
    Site.find(query)
            .then(site => res.status(200).json(site))
            .catch(error => res.status(400).json({ error }));
});

router.post('/firebase',  (req, res)=>{
    //console.log(req)   
       
    var registrationToken="egN32YgtRyKjUJaZ-Zrqs9:APA91bEoX9MGS952TeHJyqKhpaL_jUz1-2TJx1LH-yN47_M1iI6qIlMfqXTyJkW0OPOh9AzTnH8uVf4MevgOWXRrihMgGV8UTXXo5oK0BjQoVW5DpLAtjRcme16WgFZXamVU4C0BxdMI";
    
    registrationToken=req.body.token;
    Site.aggregate([{$sample: {size: 1}}])
    .then(site =>{
        console.log(site)
        const data={
            id:site[0]._id.toString(),
            nom:site[0].nom,
            description:site[0].description,
            region:site[0].region
        }
        var donnees=JSON.stringify(data)
        donnees={ data:donnees}
        const message = {        
            notification: {            
                title: "Avez-vous deja visite?",            
                body: site[0].nom        
            },             
            token: registrationToken, 
            data: donnees  || {}    
        };
        const options =  notification_options
        //console.log(message)
        //console.log(options)
        //console.log(message)
        admin.messaging().send( message)
        .then( response => {
            res.status(200).send("Notification sent successfully")
        
        }).catch(error=>{
            console.log(error)
            res.status(400).json({ error })
        })
    })
    .catch(error => {
        //console.log(error)
        res.status(400).json({ error })
    });     
  })



module.exports = router;