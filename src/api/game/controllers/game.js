'use strict';

/**
 *  game controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelUid = 'api::game.game'

module.exports = createCoreController(modelUid, ({ strapi }) =>  ({
  populate: async (ctx) => {
    console.log('starting populating')

    await strapi.service(modelUid).populate()

    ctx.send('Finished populating')
  }
}));
