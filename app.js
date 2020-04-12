const express = require('express')
const axios = require('axios');

const app = express()
app.get("/", async (req, res) => {
    recipes = await axios.get("http://www.recipepuppy.com/api/?i=onions,garlic")
    res.send(recipes.data);
})

app.listen(3000)