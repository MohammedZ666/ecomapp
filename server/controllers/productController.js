const Product = require("../models/product");
const Image = require("../models/Image");
var mongoose = require("mongoose");
const { Readable } = require("stream");
const imageThumbnail = require("image-thumbnail");
const multer = require("multer");
const { db } = require("../models/Image");
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

const product_index = async (req, res) => {
  //fetching all categories
  let categories = (
    await db.collection("settings").findOne({ name: "general" })
  ).categories;

  if (Object.keys(req.query).length === 0) {
    Product.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        res.json({
          productList: result,
          categories: categories,
        });
      })
      .catch((err) => {
        console.log("the error is " + err);
      });
  } else {
    const keywords = req.query.keywords
      .split(",")
      .map((element) => new RegExp(element, "i"));
    Product.find({
      $or: [
        { name: { $in: keywords } },
        { description: { $in: keywords } },
        { category: { $in: keywords } },
      ],
    })
      .sort({ createdAt: -1 })
      .then((result) => {
        res.json({
          productList: result,
          categories: categories,
        });
      })
      .catch((err) => {
        console.log("the error is " + err);
      });
  }
};

const product_details = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

const product_create_get = (req, res) => {
  res.render("products/create", { title: "Create A New product" });
};

const product_create_post = (req, res) => {
  upload.array("images")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "Upload Request Validation Failed" });
    } else if (!req.body.name) {
      return res.status(400).json({ message: "No photo name in request body" });
    }

    let imageIds = [];
    let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "photos",
    });
    for (let i = 0; i < req.files.length; i++) {
      try {
        const thumbnail = await imageThumbnail(req.files[i].buffer, {
          withMetaData: true,
        });
        const readablePhotoStream = new Readable();
        readablePhotoStream.push(thumbnail);
        readablePhotoStream.push(null);
        let uploadStream = bucket.openUploadStream(req.body.name);
        let id = uploadStream.id;
        imageIds.push("/images/" + id);
        readablePhotoStream.pipe(uploadStream);

        uploadStream.on("error", () => {
          return res.status(500).json({ message: "Error uploading file" });
        });

        uploadStream.on("finish", () => {
          // console.log(` adding the id :${id} ${uploadStream.id}`, id === uploadStream.id)
        });
      } catch (error) {
        console.log(`error => ${error}`);
      }
    }
    const productJson = {
      name: req.body.name,
      images: imageIds,
      price: parseInt(req.body.price),
      categories: req.body.categories.split(","),
      description: req.body.description,
    };

    //updating the categories for all products
    db.collection("settings").findOneAndUpdate(
      { name: "general" },
      {
        $push: { categories: { $each: productJson.categories } },
      }
    );

    const product = new Product(productJson);
    product
      .save()
      .then((result) => {
        res.status(201).json({ success: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ error: err });
      });
  });
};

const product_delete = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/products", result });
    })
    .catch((err) => {
      console.log(err);
    });
};
const post_comment = (req, res) => {
  const { product_id } = req.params;
  Product.findOneAndUpdate(
    { _id: product_id },
    {
      $push: { comments: req.body },
    },
    { new: true }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};
const edit_comment = async (req, res) => {
  const { product_id } = req.params;
  const { username, email, oldText, timestamp, text } = req.body;
  Product.updateOne(
    {
      _id: product_id,
      comments: {
        $elemMatch: {
          email: email,
          text: oldText,
          timestamp: timestamp,
        },
      },
    },
    {
      $set: { "comments.$.text": text },
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
const delete_comment = (req, res) => {
  const { product_id } = req.params;
  const { username, email, text, timestamp } = req.body;
  Product.findOneAndUpdate(
    {
      _id: product_id,
    },
    {
      $pull: {
        comments: {
          email: email,
          text: text,
          timestamp: timestamp,
        },
      },
    },
    { new: true }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};
module.exports = {
  product_index,
  product_details,
  product_create_get,
  product_create_post,
  product_delete,
  post_comment,
  delete_comment,
  edit_comment,
};
