const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromocodeSchema = new Schema({
    name: String,
    discount: Number
})

module.exports = mongoose.model("Promocode", PromocodeSchema);