module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    const router = require("express").Router();
  
    // Create a new User
    router.post("/signup", users.create);
  
    app.use('/api/users', router);
  };