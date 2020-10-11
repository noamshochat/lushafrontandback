
const express = require('express');
const router = express.Router();

const { getUsers } = require("../services/users");

router.get('/', async (req, res) => {

    const usersList = await getUsers();
    res.json(usersList);

});

module.exports = router;
