
const { getValue } = require('../config');
const { MongoClient } = require('mongodb');

async function initDb(db) {

}


// Connection URL
const url = getValue("mongodb_url");

// Create a new MongoClient
const client = new MongoClient(url);

const db = new Promise((res, rej) => {

    // Database Name
    const dbName = getValue("mongodb_dbname");

    // Use connect method to connect to the Server
    client.connect(function (err) {
        if (err) {
            rej(err);
        }

        console.log("Connected successfully to server");
        res(client.db(dbName));
    });


});

(async () => {

    try {
        await db;
        console.log("db connection success")

        await initDb(db);
    }

    catch (e) {
        console.error(e);
        process.exit(1);
    }

})();

module.exports = { db, client };
