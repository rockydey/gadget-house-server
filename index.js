const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());



// Root API
app.get('/', (req, res) => {
    res.send("Warehouse Management Server Is Running!");
});
app.listen(port, () => {
    console.log(`Listing Warehouse Management Server To Port ${port}`);
});