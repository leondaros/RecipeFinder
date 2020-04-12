const express = require('express');
const axios = require('axios');

const gifKey = 'cViWXzcyEX87ikHovWKmDNpsEouM4x5u';
const app = express();
app.get('/', async (req, res) => {
  const response = await getRecipes(req._parsedUrl.query);
  const recipes = await formatResponse(response, req);
  res.send(recipes);
});

const getRecipes = (params) => axios.get(`http://www.recipepuppy.com/api/?${getParams(params)}`)
  .then((res) => res.data.results)
  .catch({ error: 'No momento o serviço se encontra indisponivel' });

const getParams = (url) => {
  const key = url.split('=')[0];
  const values = limitParams(url).join(',');
  if (key === 'i') {
    return `${key}=${values}`;
  }
  return '';
};

const limitParams = (url) => {
  const values = url.split('=')[1];
  const listValues = values.split(',');
  return listValues.splice(0, 3);
};

const getGif = (title) => axios.get(`${'http://api.giphy.com/v1/gifs/search?'
            + 'q='}${title}&api_key=${gifKey}&limit=1`)
  .then((res) => res.data.data[0].embed_url)
  .catch({ error: 'No momento o serviço se encontra indisponivel' });

const formatResponse = async (recipes, params) => {
  const result = {};
  result.keywords = limitParams(params._parsedUrl.query).sort();
  if (recipes.length > 0) {
    result.recipes = await buildRecipe(recipes);
  }
  return result;
};

const buildRecipe = async (recipes) => {
  const formatedRecipes = recipes.map(async (recipe) => {
    const gif = await getGif(recipe.title);
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
