module.exports = {
  apps: [
    {
      name: 'onix-chat-app-1',
      script: 'dist/main.js',
      env: {
        APP_PORT: 3000
      }
    },
    {
      name: 'onix-chat-app-2',
      script: 'dist/main.js',
      env: {
        APP_PORT: 3001
      }
    },
    {
      name: 'onix-chat-app-3',
      script: 'dist/main.js',
      env: {
        APP_PORT: 3002
      }
    },
    {
      name: 'onix-chat-app-4',
      script: 'dist/main.js',
      env: {
        APP_PORT: 3003
      }
    },
    {
      name: 'onix-chat-app-5',
      script: 'dist/main.js',
      env: {
        APP_PORT: 3004
      }
    },
    {
      name: 'onix-chat-app-6',
      script: 'dist/main.js',
      env: {
        APP_PORT: 3005
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
