const {Schema, model} = require('mongoose')

const Load = new Schema({
    created_by: {type: String, required: true},
    assigned_to: {type: String, default: null},
    status: {type: String, required: true, enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'], default: 'NEW'},
    state: {type: String, enum: ['En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery', null], default: null},
    name: {type: String, required: true},
    payload: {type: Number, required: true},
    pickup_address: {type: String, required: true},
    delivery_address: {type: String, required: true},
    dimensions: {
        width: {type: Number, required: true},
        length: {type: Number, required: true},
        height: {type: Number, required: true}
    },
    logs: [{
        message: String,
        time: {type: Date, default: Date.now()}
    }],
    created_date: {type: Date, default: Date.now()}
}, {versionKey: false})

module.exports = model('Load', Load)
