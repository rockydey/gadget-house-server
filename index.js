const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@laptopwarehousemanageme.n3f6y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// async function run() {
//     try {
//         await client.connect();
//         const productsCollection = client.db("laptopWarehouse").collection('laptops');
//     }
//     finally {

//     }
// }
// run().catch(console.dir);

// Root API
app.get('/', (req, res) => {
    res.send("Warehouse Management Server Is Running!");
});
app.listen(port, () => {
    console.log(`Listing Warehouse Management Server To Port ${port}`);
});