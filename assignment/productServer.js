var mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name:{ type: String, required : true },
    price: {type: Number},
    avatar: {type: String},
    color: {type: String},
    type: {type: String},
    userID: {type: String},
    userName: {type: String}
});

const model = new mongoose.model('assproducts', modelSchema);

module.exports = model;