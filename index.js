const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.mongoDB_USER}:${process.env.mongoDB_PASS}@cluster0.wqlyhsd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("starToys");
    const toysCollection = client.db("starToys").collection("toysCollection");
    const userToyCollection = client
      .db("starToys")
      .collection("usertoyCollection");

    const blogsCollection = client.db("starToys").collection("blogs");

    app.get("/", (req, res) => {
      res.send("Welcome To starToy Server");
    });

    app.get("/alltoys", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { sub_category: req.query.category };
        const result = await toysCollection.find(query).toArray();
        res.send(result);
        return;
      }
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // app.get("/:category", async (req, res) => {
    //   const category = req.params.category;
    //   const query = { sub_category: `${category}` };
    //   const cursor = toysCollection.find(query);
    //   const result = cursor.toArray();
    //   res.send(result);
    // });

    app.get("/usertoys", async (req, res) => {
      let query = {};
      const toysLimit = parseInt(req.query.imit);

      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
        const result = await userToyCollection.find(query).toArray();
        res.send(result);
        return;
      }

      if (req.query?.delete) {
        query = { _id: new ObjectId(req.query.delete) };
        const result = await userToyCollection.deleteOne(query);
        res.send(result);
        return;
      }

      if (req.query?.limit) {
        const cursor = userToyCollection.find().limit(toysLimit);
        const result = await cursor.toArray();
        res.send(result);
        return;
      }

      const cursor = userToyCollection.find();

      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/usertoys/:id", async (req, res) => {
      let query = {};

      if (req.params?.id) {
        query = { _id: new ObjectId(req.params.id) };
        const result = await userToyCollection.findOne(query);
        res.send(result);
        return;
      }
    });

    app.post("/usertoys", async (req, res) => {
      const userToy = req.body;
      const result = await userToyCollection.insertOne(userToy);
      res.send(result);
    });

    app.put("/usertoys", async (req, res) => {
      const filter = { _id: new ObjectId(req.body._id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          price: req.body.price,
          quantity: req.body.quantity,
          details: req.body.details,
        },
      };
      const result = await userToyCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      console.log(req.params.id);
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Welcome To Khelaghor Server");
// });

app.listen(port, () => {
  console.log(`starToy is running on ${port}`);
});
