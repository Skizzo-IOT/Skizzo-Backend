module.exports = app => {
  var multiparty = require("connect-multiparty");
  const res = require("../controllers/res.controller.js");

  const router = require("express").Router();

  // Upload a profile picture
  multipartyLogoMiddleware = multiparty({
    uploadDir: "./data",
    maxFilesSize: "4000000",
  });

  //return file 
  router.get("/:file", res.getFile);

  router.post(
    "/upload",
    multipartyLogoMiddleware,
    res.uploadImage
  );

  router.delete(
    "/:path",
    res.deleteImage
  );

  app.use('/api/res', router);
};
