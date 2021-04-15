const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const port = 5000;
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nexck.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
