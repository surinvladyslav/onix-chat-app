module.exports = {
  apps: [{
    name: 'onix-chat-app',
    script: 'dist/main.js',
    watch: '.',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
