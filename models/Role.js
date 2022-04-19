const {Schema, model} = require('mongoose');

const Role = new Schema({
    value: {type: String, unique: true}
}, {versionKey: false});

module.exports = model('Role', Role);
