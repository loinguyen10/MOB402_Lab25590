var mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name:{ type: String, required : true },
    price: {type: Number},
    number: {type: Number}
});

const model = new mongoose.model('AssProducts', modelSchema);

module.exports = model;