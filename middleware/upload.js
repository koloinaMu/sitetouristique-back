const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    var otherData=req.body
    //console.log(otherData.nom)
    //console.log(otherData.description)
    //console.log(otherData.region)
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return {
        nom: otherData.nom,
        description: otherData.description,
        region: otherData.region,
        filename: `${Date.now()}-bezkoder-${file.originalname}`
      };
    }

    return {
      nom: otherData.nom,
      description: otherData.description,
      region: otherData.region,
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-bezkoder-${file.originalname}`
    };
  }
});
//console.log(storage)
//var uploadFiles = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage: storage }).array("file", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;