
const { db } = require("../db/mongo");

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUsers() {

    const d = await db;
    
    return new Promise((res, rej) => {
        d.collection('Users').find({}).toArray(function(err, docs) {
            if (err) rej(err);
            else res(docs);
        });
    });
    

    // return [
    //     { name: "user 1" },
    //     { name: "user 2" },
    //     { name: "user 3" },
    // ]

}

module.exports = { getUsers }
