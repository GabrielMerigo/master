'use strict';

/**
 * game service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  populate: async (params) => {
    const cat = await strapi.service('api::category.category').find()
    console.log(cat)
  }
}));
