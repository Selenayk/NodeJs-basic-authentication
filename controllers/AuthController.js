const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
    });
    user
      .save()
      .then((user) => {
        res.json({
          message: 'User Added Successfully!',
        });
      })
      .catch((err) => {
        res.json({
          message: 'An error Occured!',
        });
      });
  });
};

const login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign(
              { name: user.name },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
              }
            );
            let refreshtoken = jwt.sign(
              { name: user.name },
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
              }
            );
            res.json({
              message: 'Login Successful!',
              token,
              refreshtoken,
            });
          } else {
            res.json({
              message: 'Password does not mached!',
            });
          }
        });
      } else {
        res.json({
          message: 'No user found!',
        });
      }
    }
  );
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decode) {
    if (err) {
      res.status(400).json({
        err,
      });
      console.log(err);
    } else {
      let token = jwt.sign({ name: decode.name }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      });
      let refreshToken = req.body.refreshToken;
      res.status(200).json({
        message: 'Token refreshed successfully!',
        token,
        refreshToken,
      });
    }
  });
};

module.exports = { register, login, refreshToken };
