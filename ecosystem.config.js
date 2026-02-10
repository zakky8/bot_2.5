module.exports = {
  apps: [
    {
      name: 'telegram-bot',
      script: './telegram-bot/dist/index.js',
      cwd: './telegram-bot',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './telegram-bot/logs/error.log',
      out_file: './telegram-bot/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'discord-bot',
      script: './discord-bot/dist/index.js',
      cwd: './discord-bot',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './discord-bot/logs/error.log',
      out_file: './discord-bot/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
