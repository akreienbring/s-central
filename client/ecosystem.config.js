// pm2 configuration
module.exports = {
  apps: [
    {
      name: 'minimal',
      script: 'npm run dev',
      error_file: './pm2-error.log',
      out_file: './pm2-out.log',
    },
  ],
};
