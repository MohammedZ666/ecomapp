const Order = require("../models/order");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const place_order = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    // var topic = 'orders';

    // var message = {
    //     notification: {
    //         title: 'A new order',
    //         body: `Order by ${order.username} from ${order.address}`
    //     },
    //     topic: topic
    // };
    // var admin = require("firebase-admin");
    // // Send a message to devices subscribed to the provided topic.
    // admin.messaging().send(message)
    //     .then((response) => {
    //         // Response is a message ID string.
    //         console.log('Successfully sent message:', response);
    //     })
    //     .catch((error) => {
    //         console.log('Error sending message:', error);
    //     });

    ejs.renderFile(
      __dirname + "/../orderTemplate.ejs",
      { data: order },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          var mainOptions = {
            from: "obaida.zisan@gmail.com",
            to: req.body.email,
            subject: "Order no. " + order._id,
            html: data,
          };
          //console.log("html data ======================>", mainOptions.html);

          transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
              console.log("Mail was not sent", err);

              res.json({
                msg: "fail",
              });
            } else {
              console.log("Mail was sent");
              res.json({
                msg: "success",
              });
            }
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: error });
  }
};
const get_orders = (req, res) => {
  Order.find({ status: "new" })
    .sort({ createdAt: 1 })
    .then((result) => {
      res.json({
        orders: result,
      });
    })
    .catch((err) => {
      console.log("the error is " + err);
    });
};

const update_status = (req, res) => {
  const { order_id, new_status } = req.body;
  Order.updateOne(
    {
      _id: order_id,
    },
    {
      $set: { status: new_status },
    },
    { new: true }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
};
module.exports = {
  place_order,
  get_orders,
  update_status,
};
