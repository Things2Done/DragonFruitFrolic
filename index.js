let express = require("express");
let app = express();
app.use(express.json());

app.use('/', express.static('generator'));

const { Database } = require("quickmongo");
// Writing the password here means it will be leaked, but for convenience...
const db = new Database("mongodb+srv://yuqian:yuqianma@cluster0.v8pqot1.mongodb.net/?retryWrites=true&w=majority");
db.on("ready", () => {
    console.log("Connected to the database");
});
db.connect();

let port = process.env.PORT || 3000;
app.listen(port, ()=> {
console.log('listening at ', port);
});
