var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Utilisateur=require('../models/utilisateur')
const Token=require('../models/token')
const md5=require('md5')

router.post('/login', (req, res) => {
    let data = req.body;
    //console.log(data);
    //console.log(data.mail);
    mail=data.mail;
    var res1=String(mail)
    .toLowerCase()
    .match(/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/);
    //console.log(res1);
    var erreur=[];
    if(res1!=null){
        //console.log(erreur.erreur)
        mdp=md5(data.mdp);
        /*Token.findOne({token:data.token})
            .then(token=>{
                if(token==null){
                    const token=new Token({
                        token:data.token
                    })
                    token.save();
                }
            })        */
        Utilisateur.findOne({ mail: mail,mdp:mdp })
            .then(utilisateur => res.status(200).json(utilisateur))
            .catch(error => res.status(400).json({ error }));
    }else{
        erreur={erreur:'Mail invalide'};
        //res.send('ok erreur');
        res.status(200).json(erreur);
    }
    
})

router.post('/newToken', (req, res) => {
    let data = req.body;
    console.log(data)
    Token.deleteOne({token:data.oldToken})
        .then(()=>{
            Token.findOne({token:data.token})
            .then(token=>{
                if(token==null){
                    const tokenn=new Token({
                        token:data.token
                    })
                    tokenn.save().then(()=>res.status(201).json({ message: 'Token enregistré !'}))
                }else{
                    res.status(200).json({message:"Token deja enregistre ! "})
                }
            })
        })    
})

router.post('/inscription', (req, res) => {
    let data = req.body;
    //console.log(data);
    //console.log(data.mail);
    mail=data.mail;
    var res1=String(mail)
    .toLowerCase()
    .match(/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/);
    //console.log(res1);
    var erreur=[];
    if(res1!=null){
        //console.log(erreur.erreur)
        delete req.body._id;
        const user = new Utilisateur({
            nom: data.nom,
            prenom: data.prenom,
            mail: mail,
            mdp: md5(data.mdp)
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur enregistré !'}))
            .catch(error => res.status(400).json({ error }));
    }else{
        erreur={erreur:'Mail invalide'};
        //res.send('ok erreur');
        res.send(erreur);
    }
    
})



module.exports = router;