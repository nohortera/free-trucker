const {Schema, model} = require('mongoose');

const User = new Schema({
  role: {type: String, required: true, enum: ['SHIPPER', 'DRIVER']},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  createdDate: {type: Date, required: true}
}, {versionKey: false});

module.exports = model('User', User);
