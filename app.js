const express = require('express')
const axios = require('axios');

const app = express()
app.get("/", async (req, res) => {
    response = await getRecipes(req._parsedUrl.search)
    recipes = await formatResponse(response, req)
    res.send(recipes);
})

getRecipes = (params) => {
    return axios.get("http://www.recipepuppy.com/api/"+params)
            .then(res => res.data.results)
            .catch(function (error) {
              console.log("error: "+error);
            })
}

getGif = (title) => {
    return axios.get("http://api.giphy.com/v1/gifs/search?"+
            "q="+title+"&api_key="+"cViWXzcyEX87ikHovWKmDNpsEouM4x5u"+"&limit=1")
                .then(res => res.data.data[0].embed_url)
                .catch(function (error) {
                    console.log("error: "+error);
                })
}

formatResponse = async (recipes,params) => {
    result = {}
    result["keywords"] = params.query.i.split(",").sort()
    result["recipes"] = await buildRecipe(recipes)
    return result
}

buildRecipe = async (recipes) =>{
    recipes = recipes.map(async(recipe) => {
        let gif = await getGif(recipe.title)
        return  {   
            "title": recipe.title,
            "ingredients": recipe.ingredients.split(", ").sort(),
            "link": recipe.href,
            "gif": gif
        }
    })
    return await Promise.all(recipes)
}

app.listen(3000)