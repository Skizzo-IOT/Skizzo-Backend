module.exports = app => {
    const login = require("../controllers/login.controller.js");
  
    const router = require("express").Router();
  
    const auth = require("../middleware/auth");

    router.post("/signin", login.getToken);

    router.get("/token", auth, login.checkTokenValidity);
  
    app.use('/api/login', router);
};