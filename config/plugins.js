module.exports = {
  'repositories': {
      enabled: true,
      resolve: './src/plugins/repositories',
  },
  'entity-relationship-chart': {
    enabled: true,
    config: {
      exclude: [
        "strapi::core-store",
        "webhook",
        "admin::permission",
        "admin::user",
        "admin::role",
        "admin::api-token",
        "plugin::upload.file",
        "plugin::i18n.locale",
        "plugin::users-permissions.permission",
        "plugin::users-permissions.role",
      ],
    },
  },
}
