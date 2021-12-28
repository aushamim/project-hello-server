const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();

// middleware area
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h3zla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Hello-Users");
    const usersCollection = database.collection("Users");
    const postCollection = database.collection("All-Posts");

    // const database = client.db("Cars-BD");
    // const carsCollection = database.collection("All-Cars");
    // const ordersCollection = database.collection("All-orders");
    // const reviewsCollection = database.collection("All-reviews");
    // const usersCollection = database.collection("All-users");

    // //----------------------//
    // // get area
    // //----------------------//

    // get all users api
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // get posts
    app.get("/posts", async (req, res) => {
      const cursor = postCollection.find({});
      const posts = await cursor.toArray();
      res.send(posts);
    });

    // get a specific user api
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // // get a specific user post api
    // app.get("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const car = await postCollection.findOne(query);
    //   res.send(car);
    // });

    // // get feature cars api
    // app.get("/featureCars", async (req, res) => {
    //   const cursor = carsCollection.find({});
    //   const cars = await cursor.limit(6).toArray();
    //   res.send(cars);
    // });

    // //get orders api
    // app.get("/orders", async (req, res) => {
    //   const cursor = ordersCollection.find({});
    //   const orders = await cursor.toArray();
    //   res.send(orders);
    // });

    // // get a specific order api
    // app.get("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const order = await ordersCollection.findOne(query);
    //   res.json(order);
    // });

    // // get review api
    // app.get("/reviews", async (req, res) => {
    //   const cursor = reviewsCollection.find({});
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });

    // // get admin api
    // app.get("/users/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const user = await usersCollection.findOne(query);
    //   let isAdmin = false;
    //   if (user?.role === "admin") {
    //     isAdmin = true;
    //   }
    //   res.json({ admin: isAdmin });
    // });

    // //----------------------//
    // // post area
    // //----------------------//

    // post
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.json(result);
    });
    // // post review
    // app.post("/reviews", async (req, res) => {
    //   const car = req.body;
    //   const result = await reviewsCollection.insertOne(car);
    //   res.json(result);
    // });

    // // post orders api
    // app.post("/orders", async (req, res) => {
    //   const orders = req.body;
    //   const result = await ordersCollection.insertOne(orders);
    //   res.json(result);
    // });

    //post user data api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // //----------------------//
    // // upsert/put area
    // //----------------------//

    // upsert user
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // // add admin to db
    // app.put("/users/admin", async (req, res) => {
    //   const user = req.body;
    //   const filter = { email: user.email };
    //   const updateDoc = { $set: { role: "admin" } };
    //   const result = await usersCollection.updateOne(filter, updateDoc);
    //   res.json(result);
    // });

    // //----------------------//
    // // delete area
    // //----------------------//

    // //delete order api
    // app.delete("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await ordersCollection.deleteOne(query);
    //   res.json(result);
    // });

    // // delete cars api
    // app.delete("/allCars/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await carsCollection.deleteOne(query);
    //   res.json(result);
    // });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
