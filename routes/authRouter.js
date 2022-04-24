const router = require('express').Router();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../models/userModel');

router.post('/register', async (req, res) => {
  try {
    const hashedPass = await argon2.hash(req.body.password);
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPass,
      email: req.body.email,
      credentials: [],
    });
    user
      .save()
      .then((user) => {
        let { username, ...newUser } = user;
        res.status(200).json('user registered!');
      })
      .catch((err) => {
        res.status(400).json('username already exists!');
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user !== null) {
      if (await argon2.verify(user.password, password)) {
        const accesstoken = jwt.sign(
          {
            name: user._doc.name,
            username: user._doc.username,
            email: user._doc.email,
          },
          process.env.JWT_SECRETE_KEY,
        );
        const response = {
          name: user.name,
          username: user.username,
          email: user.email,
          credentials: user.credentials,
          accesstoken: accesstoken,
        };
        res.status(200).json(response);
      } else {
        res.status(401).json('wrong credentials');
      }
    } else {
      res.status(404).json('user credentials not found!');
    }
  } catch (err) {
    res.status(500).json('login failed');
  }
});

module.exports = router;
