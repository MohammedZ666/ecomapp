const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// "name": "Boy T-Shirt",
// "images":[],
// "price": 96.4,
// "categories":["Men", "Child"],
// "description": "This is a description of tshirt",
// "id": 1

const productSchema = new Schema({
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
    },
    comments: {
        type: Array,
        required: false
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema)

module.exports = Product;