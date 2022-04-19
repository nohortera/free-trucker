require('dotenv').config();
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const User = require("../models/User");
// const {secret} = require('../config')

module.exports = async function(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({message: 'User is not authorized'});
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, secret);
    req.user = decodedData;
    const user = await User.findOne({_id: decodedData.id})
    if (!user) {
      return res.status(400).json({message: 'AuthMiddleware error: user was not found'})
    }
    req.user.role = await user.role
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: 'Authorization middleware error'});
  }
};
