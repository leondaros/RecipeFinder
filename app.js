const express = require('express')
const app = express()

app.get("/", (req, res) =>{
    res.end("Test");
})
app.listen(3000)