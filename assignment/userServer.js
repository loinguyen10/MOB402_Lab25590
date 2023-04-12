var mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    fullname:{ type: String },
    email: {type: String},
    phone: {type: String},
    password: {type: String},
    avatar: {type: String},
    role: {type: String},
});

const model = new mongoose.model('assusers', modelSchema);

module.exports = model;