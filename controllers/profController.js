const User = require('../models/User');
const bcrypt = require('bcrypt')
const salt = 5;

// eslint-disable-next-line require-jsdoc
class ProfController {
  // eslint-disable-next-line require-jsdoc
  async getProfileInfo(req, res) {
    try {
      const id = req.user.id;
      const user = await User.findOne({_id: id});
      if (!user) {
        res.status(404).json('Not found');
      }
      const {_id, role, email, createdDate} = user;
      const modifiedUser = {
        user: {_id, role, email, createdDate},
      };
      res.status(200).json(modifiedUser);
    } catch (e) {
      console.log(e);
      res.status(500).json({message: 'GET profile error'});
    }
  }

  // eslint-disable-next-line require-jsdoc
  async deleteProfile(req, res) {
    try {
      const id = req.user.id;
      const user = await User.findOne({_id: id});
      if (!user) {
        res.status(404).json('Not found');
      }
      await user.delete()
      res.json({message: 'Profile deleted successfully'})
    } catch (e) {
      console.log(e);
      res.status(500).json({message: 'ProfileController Error'});
    }
  }

  // eslint-disable-next-line require-jsdoc
  async changePassword(req, res) {
    try {
      const id = req.user.id
      const user = await User.findOne({_id: id})
      if (!user) {
          res.status(404).json('Not found')
      }
      const {oldPassword, newPassword} = req.body
      const validPassword = bcrypt.compareSync(oldPassword, user.password)
      if (!validPassword) {
          res.status('400').json({message: 'Old password is not correct'})
      }
      const hashPassword = bcrypt.hashSync(newPassword, salt)
      await User.updateOne({_id: id}, {$set: {password: hashPassword}})
      res.json({message: 'Password changed successfully'});
    } catch (e) {
      console.log(e);
      res.status(500).json({message: 'ProfileController Error'});
    }
  }
}

module.exports = new ProfController();
