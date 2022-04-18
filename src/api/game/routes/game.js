'use strict';

/**
 * game router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/game/populate',
      handler: 'game.populate',
    }
  ]
}



