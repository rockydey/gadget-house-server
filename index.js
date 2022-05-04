const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

function verifyJWt(req, res, next) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
        return res.status(401).send({ message: "Unauthorized Access" });
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden Access" });
        }
        req.decoded = decoded;
        next();
    })
    // console.log(authHeaders);
}

// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@laptopwarehousemanageme.n3f6y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("gadgetHouse").collection("items");

        app.get('/items', async (req, res) => {
            const size = parseInt(req.query.size);
            const page = parseInt(req.query.page);
            const query = {};
            const cursor = productsCollection.find(query);
            let items;
            if (size || page) {
                items = await cursor.skip(page * size).limit(size).toArray()
            }
            else {
                items = await cursor.toArray();
            }
            res.send(items);
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

        app.get('/myitems', verifyJWt, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = productsCollection.find(query);
                const myItem = await cursor.toArray();
                res.send(myItem);
            } else {
                res.status(403).send({ message: "Forbidden Access" });
            }
        });

        // JWT AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        });

        // Pagination
        app.get('/itemsCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count });
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