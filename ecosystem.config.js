module.exports = {
  apps: [
    {
      name: 'domalyst',
      script: 'dist/main.js', // Path to your compiled Nest.js application
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
