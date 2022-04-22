'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const axios = require('axios');
const slugify = require('slugify');

async function getGameInfo(slug){
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const body = await axios.get(`https://(www.gog.com/en/game/${slug.replaceAll('-', '_')}`);
  const dom = new JSDOM(body.data)
  const description = dom.window.document.querySelector('.description');

  return {
    rating: 'FREE',
    short_description: description.textContent.slice(0, 160),
    description: description.innerHTML
  }
}

async function getByName(name, entityName){
  const item = await strapi
    .service(`api::${entityName}.${entityName}`)
    .find({
      publicationState: 'preview',
      filters: {
        name
      }
    });

  return item.results.length ? item.results[0] : null
}

async function create(name, entityName){
  const item = await getByName(name, entityName);

  if(!item){
    await strapi.service(`api::${entityName}.${entityName}`).create({
      data: {
        published_at: new Date(),
        name: name,
        slug: slugify(name, { lower: true })
      }
    })
  }
}

async function createManyToManyData(products) {
  const developers = {};
  const publishers = {};
  const categories = {};
  const platforms = {};

  products.forEach((product) => {
    const { developers: developer , publishers: publisher, genres, operatingSystems } = product;

    genres && genres.forEach(({name}) => { categories[name] = true; });
    operatingSystems && operatingSystems.forEach((item) => { platforms[item] = true });

    developers[developer] = true;
    publishers[publisher] = true;
  });

  return Promise.all([
    ...Object.keys(developers).map((name) => create(name, "developer")),
    ...Object.keys(publishers).map((name) => create(name, "publisher")),
    ...Object.keys(categories).map((name) => create(name, "category")),
    ...Object.keys(platforms).map((name) => create(name, "platform")),
  ]);
}

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  populate: async (params) => {
    const gogAPIUrl = `https://catalog.gog.com/v1/catalog?limit=48&price=between%3A80%2C380&order=desc%3Atrending&productType=in%3Agame%2Cpack&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`;
    const { data: { products } } = await axios.get(gogAPIUrl);

    // console.log(await createManyToManyData(products));
  }
}));
