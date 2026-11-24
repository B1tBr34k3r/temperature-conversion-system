/**
 * PM2 Process Management Configuration
 * Milestone 5: Production Deployment & Process Clustering
 */

module.exports = {
  apps: [
    {
      name: 'sdms-temperature-app',
      script: './server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './server/data/pm2_err.log',
      out_file: './server/data/pm2_out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
