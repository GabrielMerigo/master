'use strict';

/**
 *  game controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelUid = 'api::game.game'

module.exports = createCoreController(modelUid, ({ strapi }) =>  ({
  populate: (ctx) => {
    console.log(ctx, strapi, 'teste nelson')
    ctx.send({ ok: true })
  }
}));
