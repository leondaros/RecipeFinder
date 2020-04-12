const express = require('express')
const axios = require('axios');

const app = express()
app.get("/", async (req, res) => {
    response = await getRecipes(req._parsedUrl.search)
    recipes = formatResponse(response, req)
    res.send(recipes);
})

getRecipes = (params) => {
    return axios.get("http://www.recipepuppy.com/api/"+params)
            .then(res => res.data.results)
}

formatResponse = (recipes,params) => {
    result = {}
    result["keywords"] = params.query.i.split(",").sort()
    result["recipes"] = recipes.map((recipe)=>{
        return {
            "title": recipe.title,
            "ingredients": recipe.ingredients.split(", ").sort(),
            "link": recipe.href,
            "gif": ""
        }
    })
    return result
}

app.listen(3000)