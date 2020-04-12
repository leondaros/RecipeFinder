const express = require('express')
const axios = require('axios');

const app = express()
app.get("/", async (req, res) => {
    response = await getRecipes(req._parsedUrl.query)
    recipes = await formatResponse(response, req)
    res.send(recipes);
})

getRecipes = (params) => {
    return axios.get("http://www.recipepuppy.com/api/?"+getParams(params))
            .then(res => res.data.results)
            .catch(function (error) {
              return { error: "No momento o serviço se encontra indisponivel" }
            })
}

getParams = (url) => {
    let key = url.split("=")[0]
    let values = limitParams(url).join(",")
    if(key=="i"){
        return key+"="+values
    }
    return ""
}

limitParams = (url) =>{
    let values = url.split("=")[1]
    let list_values = values.split(",")
    return list_values.splice(0,3)
}

getGif = (title) => {
    return axios.get("http://api.giphy.com/v1/gifs/search?"+
            "q="+title+"&api_key="+"cViWXzcyEX87ikHovWKmDNpsEouM4x5u"+"&limit=1")
                .then(res => res.data.data[0].embed_url)
                .catch(function (error) {
                    return { error: "No momento o serviço se encontra indisponivel" }
                })
}

formatResponse = async (recipes,params) => {
    result = {}
    result["keywords"] = limitParams(params._parsedUrl.query).sort()
    if(recipes.length>0){
        result["recipes"] = await buildRecipe(recipes)
    }
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