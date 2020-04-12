const express = require('express')
const axios = require('axios');

const app = express()
app.get("/", async (req, res) => {
    recipes = await getRecipes(req._parsedUrl.search)
    res.send(recipes.data);
})

getRecipes = (params) => {
    return axios.get("http://www.recipepuppy.com/api/"+params)
}

app.listen(3000)