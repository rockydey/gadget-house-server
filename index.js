const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@laptopwarehousemanageme.n3f6y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("gadgetHouse").collection("items");

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await productsCollection.findOne(query);
            res.send(item);
        });

        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    picture: updateItem.picture,
                    quantity: updateItem.quantity,
                    name: updateItem.name,
                    supplier: updateItem.supplier,
                    price: updateItem.price,
                    description: updateItem.description
                }
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });

        app.post('/item', async (req, res) => {
            const item = req.body;
            const result = await productsCollection.insertOne(item);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

// Root API
app.get('/', (req, res) => {
    res.send("Warehouse Management Server Is Running!");
});
app.listen(port, () => {
    console.log(`Listing Warehouse Management Server To Port ${port}`);
});