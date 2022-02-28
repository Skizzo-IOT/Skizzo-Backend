const path = require('path');
var fs = require('fs');

// Get a file
exports.getFile = async (req, res) => {
  console.log("Get File");
  let filePath = path.join(__dirname, "../data/", req.params.folder, "/", req.params.file);

  return res.sendFile(filePath, function (err) {
    if (err) {
      console.log(err);
      return res.status(err.status).end();
    } else {
      console.log('Sent:', filePath);
    }
  });
};

exports.uploadImage = async (req, res) => {
  const userId = req.params.userId;
  try {
    const filePath = req.files["image"].path;
    var parts = filePath.split('\\');
    console.log(parts.pop() || parts.pop());
    
/*       .replace("data\\", "")
      .replace("\\", "/"); */

/*     const checkCompanyProfile = await CompanyProfile.findOne({
      where: { userId: userId },
    });

    CompanyProfile.update(
      { logo: filePath },
      {
        where: { userId: userId },
      }
    );
    if (checkCompanyProfile.logo !== null) {
      fs.unlink("data/" + checkCompanyProfile.logo, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } */
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