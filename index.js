//initailization
let express = require('express');
let app = express();
//configure express to parse json automatically in request bodies
app.use(express.json());

//Import quickmongo 
const { Database } = require("quickmongo");
//create new database in Mongodb
const db = new Database(`mongodb+srv://brooklynhumanist:5EO8UdybBu2Kkv6r@cluster0.x3shmbu.mongodb.net/?retryWrites=true&w=majority`)

//connect to database
db.connect()
.then(() => console.log("Successfully connected to the database"))
   .catch(err => console.error("Database connection failed:", err));

//listen for 'ready' event to confirm db is connected
db.on("ready", async () => {
    console.log("Connected to the database");
//identify error with db connection
});
db.on("error", (error) => {
    console.error("Error with the database connection:", error);
});

//removed this array as redundant to db use
// let entriesData = [];


// app.post('/entered', async (req, res) => {
//     console.log("Received data at /entered:", req.body);
//     // entries.push(req.body)
//     // console.log(entries)

//     try {
        
//         const result = await db.push('entriesData', req.body);
//         console.log("Data pushed to database:", result);
//         res.json({ task: "success" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred with the database operation.' });
//     }    
// });

//defined post route for /entered to listen for data
app.post('/entered', async (req, res) => {
    console.log("Received data at /entered:", req.body);

    try {
//attempt to push data to entriesData database
        const result = await db.push('entriesData', req.body);
        console.log("Data pushed to database:", result);
//respond with success message
        res.json({ task: "success" });
    } catch (error) {
        console.error("Error during database operation:", error);
        // Log detailed error information
        if (error instanceof Error) {
            console.error("Error stack:", error.stack);
        } else {
            console.error("Error object:", error);
        }
        res.status(500).json({ error: 'An error occurred with the database operation.' });
    }
});

//serve static client side files from public directory
app.use('/', express.static('public'));

//start server
app.listen(1234, () => {
    console.log('listening:1234');
});

//define a Get route for /getEntries
app.get('/getEntries', async (req, res) => {
    try {
    //retrieve entriesData from the database
        const data = await db.get('entriesData');
        console.log("Data retrieved from database:", data);
//set content type to json        
        res.setHeader('Content-Type', 'application/json');
//respond with retrieved data
        res.json(data);
//identify and log any errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve entries.' });
    }
});