module.exports = app => {
  var multiparty = require("connect-multiparty");
  const res = require("../controllers/res.controller.js");

  const router = require("express").Router();

  // Upload a profile picture
  multipartyLogoMiddleware = multiparty({
    uploadDir: "./data",
    maxFilesSize: "4000000",
  });

  router.post(
    "/upload",
    multipartyLogoMiddleware,
    res.uploadImage
  );

  router.get("/getAll",res.getAll);

  router.get("/data/:file", res.getFile);

  router.delete(
    "/data/:file",
    res.deleteImage
  );

  app.use('/api/res', router);
};
