const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.92hpr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function server() {
  try {
    await client.connect();
    console.log("Connection to Database established");
    const database = client.db("Get_Away");
    const contactCollection = database.collection("Contacts");
    const imageCollection1 = database.collection("Image_Gallery_1");
    const destinationCollection = database.collection("Destinations");
    const tourCollection = database.collection("Tour_List");
    const orderCollection = database.collection("Orders");
    const teamCollection = database.collection("Our_Team");

    // Load Images
    app.get("/gallery1", async (req, res) => {
      const cursor = imageCollection1.find({});
      const gallery1 = await cursor.toArray();
      res.json(gallery1);
      // console.log(gallery1);
    });

    // Load Contacts
    app.get("/contacts", async (req, res) => {
      const cursor = contactCollection.find({});
      const contacts = await cursor.toArray();
      res.json(contacts);
      // console.log(contacts);
    });

    // Load Destinations
    app.get("/destinations", async (req, res) => {
      const cursor = destinationCollection.find({});
      const destinations = await cursor.toArray();
      res.json(destinations);
      // console.log(destinations);
    });

    // Load Single Description
    app.get("/destinations/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const destination = await destinationCollection.findOne(query);
      res.json(destination);
      // console.log(destination);
    });

    // Destinations API
    app.post("/destinations", async (req, res) => {
      const destination = req.body;

      const result = await destinationCollection.insertOne(destination);
      res.json(result);
      // console.log("Destination", result);
    });

    // Load Tour List
    app.get("/tourList", async (req, res) => {
      const cursor = tourCollection.find({});
      const tourList = await cursor.toArray();

      res.json(tourList);
      // console.log(tourList);
    });

    // Load Single Tour_List
    app.get("/tourList/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const tour = await tourCollection.findOne(query);
      res.json(tour);
      // console.log(tour);
    });

    // Load Orders
    app.post("/allOrders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
      console.log("Orders Found", result);
    });

    // GET All Orders
    app.get("/allOrders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orderList = await cursor.toArray();
      res.json(orderList);
      // console.log("Orders Found", orderList);
    });

    // DELETE Order
    app.delete("/allOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log(query);

      const result = await orderCollection.deleteOne(query);
      res.json(result);
      console.log("Order Deleted Successfully", result);
    });

    // Deny an Order
    app.put("/allOrders/:id", async (req, res) => {
      console.log("Order ID", req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedOrder = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc, options);
      res.json(result);
      console.log(`Order has been ${updatedOrder.status} successfully`, result);
    });

    // GET TEAM
    app.get("/ourTeam", async (req, res) => {
      const cursor = teamCollection.find({});
      const ourTeam = await cursor.toArray();
      res.json(ourTeam);
      console.log("check us out", ourTeam);
    });
  } finally {
    await console.log("Database has been initialized");
  }
}
server().catch((error) => console.log(error));
console.log(uri, "The uri is responding.");

// basic server setup
app.get("/", (req, res) => {
  res.send("This is Server Side Data");
});

app.listen(port, (req, res) => {
  console.log("Database is transmitting");
});
