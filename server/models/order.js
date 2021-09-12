const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        required: true,
    },
    counts: {
        type: Array,
        required: true,
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;