module.exports = {
  apps: [
    {
      name: "shellybroker",
      script: "node --watch shellybroker.js",
      instance_var: "INSTANCE_ID",
      env: {
        NODE_PORT: "3031",
        NODE_CONFIG_DIR: __dirname + "/config/",
      },
      log_date_format: "YYYY-MM-DD HH:mm",
    },
  ],
};
