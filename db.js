// require "pg" and destructure for Client
const { Client } = require("pg")

let DB_URI;


// enter DB_URI dependent on environment
if (process.env.NODE_ENV === "test"){
    DB_URI = "postgresql:///tl_test";
}
else {
    DB_URI = process.env.DB_URI;
}

// make new client with DB_URI
let db = new Client ({
    connectionString: DB_URI
})

// connect Client
db.connect();

module.exports = db;