
const { getValue } = require("../config/index");

const axios = require('axios');

async function getUsers() {
    const res = await axios.get(`${getValue("backend_url")}/api/users`);
    return res.data;
}

module.exports = { getUsers }
