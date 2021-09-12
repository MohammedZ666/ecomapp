const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// "name": "Boy T-Shirt",
// "images":[],
// "price": 96.4,
// "categories":["Men", "Child"],
// "description": "This is a description of tshirt",
// "id": 1

const cartSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categories: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart;