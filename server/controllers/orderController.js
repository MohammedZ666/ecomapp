const Order = require('../models/order')

const place_order = async (req, res) => {
    console.log(req.body)
    try {
        const order = await Order.create(req.body)
        console.log(order)
        res.status(200).json({ msg: "success" })
        var topic = 'orders';

        var message = {
            notification: {
                title: 'A new order',
                body: `Order by ${order.username} from ${order.address}`
            },
            topic: topic
        };
        var admin = require("firebase-admin");
        // Send a message to devices subscribed to the provided topic.
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

    }
    catch (error) {
        res.status(404).json({ msg: error })
    }

}
const get_orders = (req, res) => {
    Order.find({ status: "new" }).sort({ createdAt: 1 })
        .then((result) => {
            res.json({
                "orders": result,
            })

        }).catch((err) => {
            console.log("the error is " + err)
        });
}

const update_status = (req, res) => {
    const { order_id, new_status } = req.body
    Order.updateOne({
        _id: order_id,
    }, {
        $set: { status: new_status }
    }, { new: true }).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.status(404).send(err)
    });
}
module.exports = {
    place_order,
    get_orders,
    update_status
}