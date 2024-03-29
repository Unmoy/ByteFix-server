const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;

const port = process.env.PORT || 5000;

require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nexck.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client.db("RepairStore").collection("services");
  const reviewsCollection = client.db("RepairStore").collection("reviews");
  const ordersCollection = client.db("RepairStore").collection("orders");
  const adminCollection = client.db("RepairStore").collection("admins");

  app.get("/", (req, res) => {
    res.status(200).json({ message: "ByteFix Server is Running" });
  });
  app.post("/addService", (req, res) => {
    const imageUrl = req.body.imageUrl;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const subHeading1 = req.body.subHeading1;
    const subDescription1 = req.body.subDescription1;
    const subHeading2 = req.body.subHeading2;
    const subDescription2 = req.body.subDescription2;
    const subHeading3 = req.body.subHeading3;
    const subDescription3 = req.body.subDescription3;
    servicesCollection
      .insertOne({
        name,
        price,
        imageUrl,
        description,
        subHeading1,
        subDescription1,
        subHeading2,
        subDescription2,
        subHeading3,
        subDescription3,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  // app.get("/showservice", (req, res) => {
  //   servicesCollection.find({})((err, documents) => {
  //     console.log(documents);
  //     res.send(results);
  //   });
  // });

  app.get("/showallservice", function (req, res) {
    servicesCollection.find().toArray(function (err, items) {
      if (Array.isArray(items)) {
        console.log("It is an array!");
        res.send(items);
      } else {
        console.log("It is not an array!");
      }
      if (err) console.log(err);
    });
  });

  app.get("/getservice/:id", (req, res) => {
    servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.post("/addReviews", (req, res) => {
    const reviewimageUrl = req.body.imageUrl;
    const name = req.body.name;
    const comment = req.body.comment;
    console.log("74", req.body);
    reviewsCollection
      .insertOne({ name, comment, reviewimageUrl })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/showreviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/addorder", (req, res) => {
    const orderDetails = req.body;
    ordersCollection.insertOne(orderDetails).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.patch("/updateStatus/:id", (req, res) => {
    console.log("91", req.body.value);
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { process: req.body.value },
        }
      )
      .then((result) => {
        // console.log("100", result.modifiedCount > 0);
        res.send(result.modifiedCount > 0);
      });
  });
  app.post("/showOrderedService", (req, res) => {
    const email = req.body.email;
    console.log(email);
    ordersCollection.find({ user_email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addadmin", (req, res) => {
    const email = req.body;
    console.log(email);
    adminCollection.insertOne(email).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ adminemail: email }).toArray((err, documents) => {
      res.send(documents.length > 0);
    });
  });

  app.get("/showorders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    servicesCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      });
  });
});

app.listen(port);
