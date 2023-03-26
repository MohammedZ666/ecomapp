const express = require("express");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const imageRoutes = require("./routes/imageRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const cors = require("cors");
const publicDir = "/public/";

// express app
const app = express();

//Cors Configuration
app.use(cors());

// connect to mongodb & listen for requests
const dbURI = process.env.DB_KEY;
let db;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    db = result.connection.db;
    // Node Mailer Configuration
    var nodemailer = require("nodemailer");

    //Creating transport instance
    var transport = {
      host: "smtp.gmail.com",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    };
    // Creating a Nodemailer Transport instance
    const transporter = nodemailer.createTransport(transport);

    // Verifying the Nodemailer Transport instance
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to send emails");
      }
    });
    app.listen(process.env.PORT || 3000, function () {
      console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
      );
    });
  })
  .catch((err) => console.log(err));

//initializing firebase admin for fcm
// var admin = require("firebase-admin");
// var serviceAccount = require("./config/firebase_secret.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// middleware & static files
app.use(express.static(path.join(__dirname, publicDir)));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
//app.get('*', checkUser)
app.get("/user", checkUser);
app.use("/data/order", orderRoutes);
app.use("/data/products", productRoutes);
app.use("/data/cart", cartRoutes);
app.use("/images", imageRoutes);
//auth routes
app.use(authRoutes);
// 404 page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, publicDir + "/index.html"));
});
