module.exports = {
  apps: [
    {
      name: 'onix-chat-app-1',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 3000
      }
    },
    {
      name: 'onix-chat-app-2',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 3001
      }
    }
  ]
};

// module.exports = {
//   apps: [
//     {
//       name: 'onix-chat-app',
//       script: './dist/main.js'
//     },
//   ],
// };
