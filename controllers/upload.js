const upload = require("../middleware/upload");
const dbConfig = require("../config/db");
const Site=require('../models/site');
var formidable = require('formidable');
const fs = require('fs')

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.url;

const baseUrl = "http://localhost:3000/files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  console.log("INSIDE THIS")
  
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //console.log(fields)
        //console.log(files.file)
        const fileUp=files.file
        var b64=[]
        for (f in fileUp){
          //console.log(fileUp[f])
          const filePath = fileUp[f].filepath;
          const bitmap = fs.readFileSync(filePath);
          // convert the binary data to base64 encoded string
          var b= bitmap.toString('base64');
          b64.push(b)
        }
        //console.log(fields.nom[0])
        const site=new Site({
          nom:fields.nom[0],
          description:fields.description[0],
          region:fields.region[0],
          files:b64
        })
        site.save()
            .then(() => res.status(201).json({ message: 'Site enregistré !'}))
            .catch(error => res.status(400).json({ error }));
        
    });
    //console.log('req body')
    //console.log(req)
    var ids=[]
    for (f in req.files){
      //console.log(f)
      ids.push(req.files[f].id)
    }
};


const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    console.log(dbConfig)
    console.log(database)
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if ((await images.countDocuments()) === 0) {
      console.log(images)
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      console.log(doc)
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
};
