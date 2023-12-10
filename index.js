//initailization
let express = require('express');
const { Database } = require("quickmongo");

let app = express();
app.use(express.json());

// set DB_URL in .env
// user:pwd@cluster0.v8pqot1.mongodb.net
const db = new Database('mongodb+srv://' + process.env.DB_URL + '/?retryWrites=true&w=majority');
db.on("ready", () => {
    console.log("Connected to the database");
});
db.on("error", (error) => {
    console.error("Error with the database connection:", error);
});
db.connect()
.then(() => console.log("Successfully connected to the database"))
   .catch(err => console.error("Database connection failed:", err));



let entriesData = [];


app.post('/entered', async (req, res) => {
    console.log("Received data at /entered:", req.body);
    // entries.push(req.body)
    // console.log(entries)

    try {
        
        const result = await db.push('entriesData', req.body);
        console.log("Data pushed to database:", result);
        res.json({ task: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred with the database operation.' });
    }    
})

app.use('/', express.static('public'));
app.listen(1234, () => {
    console.log('listening:1234');
});

// app.get('/getEntries',(req,res)=>{
//     let obj = {data:entries};
//     res.json(obj);
// })
app.get('/getEntries', async (req, res) => {
    try {
        const data = await db.get('entriesData');
        console.log("Data retrieved from database:", data);
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve entries.' });
    }
});