
var createError = require("http-errors");
const express = require('express')
var path = require("path");
var cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongo = require('mongodb');
const uri =
"mongodb://127.0.0.1:27017/sitetouristique";
var md5=require("md5");

const app = express()
const port = 3000

const dbConfig = require("./config/db");
const url=dbConfig.url + dbConfig.database
//mongoose.connect('mongodb://0.0.0.0:27017/sitetouristique?retryWrites=true&w=majority',
//mongoose.connect('mongodb+srv://Koloina:Kokoloina.2422@cluster0.6vrux.mongodb.net/?retryWrites=true&w=majority',
mongoose.connect(url,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const loginRouter=require('./routes/login')
const sitesRouter=require('./routes/site')
//const homeController = require("./controllers/home");
const uploadController = require("./controllers/upload");


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// routes config
/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/
//app.get("/", homeController.getHome);
app.post("/upload", uploadController.uploadFiles);
app.get("/files", uploadController.getListFiles);
app.use('/user',loginRouter);
app.use('/site',sitesRouter);

var MongoClient=mongo.MongoClient;
 

app.get('/sites',function(req,res) {
	MongoClient.connect(uri,function (err,db) {
		if(err) throw err;
		var dbo=db.db("sitetouristique");
		dbo.collection("sites").find({}).toArray(function (err,ress) {
			db.close();
			res.send(ress);
		})
	})
});


app.get('/details_site/:id',function(req,res) {
	var id=req.params.id;
	MongoClient.connect(uri,function (err,db) {
		if(err) throw err;
		
		var myquery = { _id: new mongo.ObjectId(id) };
		var dbo=db.db("sitetouristique");
	
		dbo.collection("sites").find(myquery).toArray(function (err,ress) {
			//console.log(query);
			db.close();			
			res.send(ress);
		});
	})
});

//app
const server=app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`)
})

module.exports = app;
