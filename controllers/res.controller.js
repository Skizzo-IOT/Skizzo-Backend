const path = require('path');
var fs = require('fs');

// Get a file
exports.getFile = async (req, res) => {
  console.log("Get File");
  let filePath = path.join(__dirname, "../data/", req.params.file);

  return res.sendFile(filePath, function (err) {
    if (err) {
      console.log(err);
      return res.status(err.status).end();
    } else {
      console.log('Sent:', filePath);
    }
  });
};

exports.getAll = async (req, res) => {
  console.log("Get All");
  const directoryPath = path.join(__dirname, "../data/");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    console.log(files);
    return res.json({files});
});
};

exports.uploadImage = async (req, res) => {
  console.log(req.files);
  try {
    const filePath = req.files["image"].path;
    
    // SUCCESS, Image successfully uploaded
    return res.send(filePath);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/", req.params.path);
    
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(filePath);
        console.error(err);
        return;
      }
    });
    
    // SUCCESS, Image successfully uploaded
    return res.send(req.params.path);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};