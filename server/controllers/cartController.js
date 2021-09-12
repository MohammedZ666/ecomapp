const Cart = require('../models/cart')
const create_cart = (req, res) => {
    const { product, count, cart } = req.body
    console.log(req.body)
    Cart.create({ cart }, (err, doc) => {
        if (err) console.log(error)
    })
    res.status(200).json({ message: "success" })
}
module.exports = {
    create_cart
}