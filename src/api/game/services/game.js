'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const axios = require('axios');
const slugify = require('slugify');

async function getGameInfo(slug){
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const slugFormatted = slug.replaceAll('-', '_')

  const body = await axios.get(`https://www.gog.com/en/game/${slugFormatted}`);
  const dom = new JSDOM(body.data)
  const description = dom.window.document.querySelector('.description');

  return {
    rating: 'Free',
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

  return item.results.length ? item.results[0] : null;
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

async function createGames(products) {
  await Promise.all(
    products.map(async (product) => {
      const item = await getByName(product.title, "game");

      if (!item) {
        console.info(`Creating: ${product.title}...`);
        console.log(products)

        const game = await strapi.service('api::game.game').create({
          data: {
            name: product.title,
            slug: product.slug,
            price: product.price.finalMoney.amount,
            release_date: product.releaseDate.replaceAll('.', '-'),
            categories: await Promise.all(product.genres.map(({name}) => getByName(name, "category"))),
            platforms: await Promise.all(
              product.operatingSystems.map((name) => getByName(name, "platform"))
            ),
            developers: await getByName(product.developers[0], "developer"),
            publisher: await getByName(product.publishers[0], "publisher"),
            cover: product.coverHorizontal,
            gallery: product.coverVertical,
            ...(await getGameInfo(product.slug))
          }
        });
        console.info(`Created: ${product.title}`);
        return game;
      }
    })
  );
}

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  populate: async (params) => {
    const gogAPIUrl = `https://catalog.gog.com/v1/catalog?limit=48&price=between%3A80%2C380&order=desc%3Atrending&productType=in%3Agame%2Cpack&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`;
    const { data: { products } } = await axios.get(gogAPIUrl);
    const item = await strapi
      .service(`api::game.game`)
      .find({
        filters: {
          name: 'Medieval Dynasty'
        }
      });
    // Everything ok... but I need to see if developers and platforms are correct.
    createGames([products[8]])
  }
}));
