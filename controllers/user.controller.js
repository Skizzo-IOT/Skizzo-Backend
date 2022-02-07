const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Create a user
exports.create = async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) {
    return res.status(400).send("All input is required");
  }

  //Check if user already exists
  const checkUser = await User.findOne({
    where: {
      email: email,
    },
  });

  if (checkUser) {
    return res.status(409).send("User Already Exist.");
  }

  bcrypt.hash(password, saltRounds)
    .then(hash => {
      const user = {
        email: email,
        password: hash,
      };

      User.create(user)
        .then((value) => res.status(201).json({ value }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};