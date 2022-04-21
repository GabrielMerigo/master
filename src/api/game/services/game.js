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
    .service(`api:${entityName}:${entityName}`)
    .find({
      data: { name }
    })
}

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  populate: async (params) => {
    const gogAPIUrl = `https://catalog.gog.com/v1/catalog?limit=48&price=between%3A80%2C380&order=desc%3Atrending&productType=in%3Agame%2Cpack&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`;
    const { data: { products } } = await axios.get(gogAPIUrl);
    console.log(products[1])

    // await strapi.service('api::publisher.publisher').create({
    //   data: {
    //     published_at: new Date(),
    //     name: products[1].publishers[0],
    //     slug: slugify(products[1].publishers[0].toLowerCase())
    //   }
    // })

    await strapi.service('api::developer.developer').create({
      data: {
        published_at: new Date(),
        name: products[1].developers[0],
        slug: slugify(products[1].developers[0].toLowerCase())
      }
    })
  }
}));
