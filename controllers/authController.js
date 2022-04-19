require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
// const {secret} = require('../config')
const secret = process.env.SECRET_KEY;
const salt = 5;

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secret);
};

// eslint-disable-next-line require-jsdoc
class AuthController {
  // eslint-disable-next-line require-jsdoc
  async register(req, res) {
    try {
      const {email, password, role} = req.body;
      const candidate = await User.findOne({email});
      if (candidate) {
        // eslint-disable-next-line max-len
        return res.status(400).json({message: `User with email '${email}' already exists`});
      }
      const hashPassword = bcrypt.hashSync(password, salt);
      // eslint-disable-next-line max-len
      const user = await new User({role, email, password: hashPassword, createdDate: Date.now()});
      await user.save();
      res.status(200).json({message: 'Profile created successfully'});
    } catch (e) {
      console.log(e);
      try {
        res.status(500).json({message: 'Registration failed'});
      } catch (e) {
        console.log(e)
      }
    }
  }
  // eslint-disable-next-line require-jsdoc
  async login(req, res) {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if (!user) {
        // eslint-disable-next-line max-len
        return res.status(400).json({message: `User with email '${email}' does not exist`});
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({message: 'Invalid password'});
      }
      const token = generateAccessToken(user._id);
      res.json({jwt_token: token});
    } catch (e) {
      console.log(e);
      try {
        res.status(500).json({message: 'Login failed'});
      } catch (e) {
      console.log(e)
      }
    }
  }

  async forgotPassword(req, res) {
    try {
      res.json({message: 'New password sent to your email address'})
    } catch (e) {
      console.log(e)
      try {
        res.status(500).json({message: 'ForgotPassword error'})
      } catch (e) {
        console.log(e)
      }
    }
  }
}

module.exports = new AuthController();
