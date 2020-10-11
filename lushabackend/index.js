const express = require('express')
const app = express()

const usersRouter = require("./api/users");

const PORT = process.env.PORT || 8080

app.get('/healthcheck', (req, res) => { res.sendStatus(200); })

app.use('/api/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
