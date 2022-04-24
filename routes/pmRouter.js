const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, user) => {
      if (err) {
        return res.status(403).json('Token is invalid!');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};

router.post('/add', verify, async (req, res) => {
  await User.updateOne(
    { username: req.user.username },
    {
      $push: {
        credentials: {
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
          url: req.body.url,
        },
      },
    },
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(200).json(err);
    });
});

router.delete('/delete/:credId', verify, async (req, res) => {
  const credId = req.params.credId;

  await User.updateOne(
    { username: req.user.username },
    { $pull: { credentials: { _id: credId } } },
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(200).json(err);
    });
});

module.exports = router;
