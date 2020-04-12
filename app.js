const express = require('express');
const axios = require('axios');

const gifKey = 'cViWXzcyEX87ikHovWKmDNpsEouM4x5u';
const app = express();
app.get('/recipes/', async (req, res) => {
  let response = await getRecipes(req._parsedUrl.query);
  let recipes = await formatResponse(response, req);
  res.send(recipes);
});

const getRecipes = (params) => axios.get(`http://www.recipepuppy.com/api/?${getParams(params)}`)
  .then((res) => res.data.results)
  .catch({ error: 'No momento o serviço se encontra indisponivel' });

const getParams = (url) => {
  let key = url.split('=')[0];
  let values = limitParams(url).join(',');
  if (key === 'i') {
    return `${key}=${values}`;
  }
  return '';
};

const limitParams = (url) => {
  let values = url.split('=')[1];
  let listValues = values.split(',');
  return listValues.splice(0, 3);
};

const getGif = (title) => axios.get(`${'http://api.giphy.com/v1/gifs/search?q='}${title}&api_key=${gifKey}&limit=1`)
  .then((res) => res.data.data[0].embed_url)
  .catch({ error: 'No momento o serviço se encontra indisponivel' });

const formatResponse = async (recipes, params) => {
  let result = {};
  result.keywords = limitParams(params._parsedUrl.query).sort();
  if (recipes.length > 0) {
    result.recipes = await buildRecipe(recipes);
  }
  return result;
};

const buildRecipe = async (recipes) => {
  let formatedRecipes = recipes.map(async (recipe) => {
    let gif = await getGif(recipe.title);
    return {
      title: recipe.title,
      ingredients: recipe.ingredients.split(', ').sort(),
      link: recipe.href,
      gif,
    };
  });
  return Promise.all(formatedRecipes);
};

app.listen(3000);
