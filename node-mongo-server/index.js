const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 4000;

// middleware
app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Running my server")
})

// db connect

const uri = "mongodb+srv://mydb-2:P0uyX7gY4YpquPrc@cluster0.zighg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("mydb-2").collection("users");

  async function run() {
    try {
      await client.connect();
      const database = client.db("mydb-2");
      const usersCollection = database.collection("users");

      // GET API for get user from db
      app.get("/users", async(req,res) => { 
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users)

      })

      // POST API for send data to db
      app.post("/users", async (req, res) => { 
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        // console.log("hitting the post", req.body)
        // console.log(result)
        res.json(result)
      })

     //  delete api for delete data from db and ui
      app.delete("/users/:id", async(req, res) => { 
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        console.log("deleting id " + result);
        res.json(result)
      })

      // get api for update a user

      app.get("/users/:id", async(req,res) => { 
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await usersCollection.findOne(query);
        console.log("user id" + id);
        res.send(user)
      })
       
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
    
});




app.listen(port, (req, res) => { 
    console.log("Running port "+ port)
})


// db user - mydb-2
// db pass - P0uyX7gY4YpquPrc
