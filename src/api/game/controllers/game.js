'use strict';

/**
 *  game controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelUid = 'api::game.game'

module.exports = createCoreController(modelUid, ({ strapi }) =>  ({
  populate: async (ctx) => {
    console.log('starting populating')

    const options = {
      limit: 48,
      price: 'between%3A80%2C380',
      order: 'desc%3Atrending',
      productType: 'in%3Agame%2Cpack',
      page: 1,
      countryCode: 'BR',
      locale: 'en-US',
      currencyCode: 'BRL'
    }

    await strapi.service(modelUid).populate(options)

    ctx.send('Finished populating')
  }
}));
