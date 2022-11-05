const express = require("express");
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`listening from port ${port}`)
})

/*-----------------
 connect mongoDB 
 ------------------*/
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mniec4l.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        /* created a DB in server and mongoDB */
        const productCollection = client.db('react-ecommerce').collection('products');

        /*(READ) created API to get/read all data from DB*/
        app.get('/products', async (req, res) => {

            /* load data based on pagination query */
            const currentPage = req.query.page;
            const itemsPerPage = parseInt(req.query.size);
            console.log(currentPage, itemsPerPage)
            /* --------------------------------------- */
            const query = {}
            const cursor = productCollection.find(query)

            /* load data based on pagination query */
            const products = await cursor.skip(currentPage * itemsPerPage).limit(itemsPerPage).toArray();
            /* --------------------------------------- */

            /* load all data await cursor.toarray()*/
            /* to show only 1st 10 data  use {await cursor.limit(10).toArray()}*/

            const count = await productCollection.countDocuments();
            res.send({ count, products })
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));

