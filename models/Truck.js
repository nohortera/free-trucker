const {Schema, model} = require('mongoose')

const Truck = new Schema({
    created_by: {type: String, required: true},
    assigned_to: {type: String, default: null},
    type: {type: String, required: true, enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT']},
    status: {type: String, enum: ['OL', 'IS', null], default: null},
    created_date: {type: Date, default: Date.now()}
}, {versionKey: false})

module.exports = model('Truck', Truck)
