![prismaliser](https://github.com/surinvladyslav/onix-chat-app/assets/67697556/7e0b98f7-500e-446c-b3cd-9fe6af65847f)# Onix Chat App

## Description
Welcome to Onix Chat App, a test project developed for Onix Company. This application is a simple chat application.

## Stack

> Nest.js API. Supports PostgreSQL, Socket.io, PM2, Prisma, Docker, Docker-compose, Min.io, Swagger, EJS

## Prisma Scheme
![prismaliser](https://github.com/surinvladyslav/onix-chat-app/assets/67697556/7b3539bc-8ef3-4690-b921-9b01230c3efa)

## Running the API
### Development
To start the application in development mode, run:
To run the Onix Chat App locally, follow these steps:

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/surinvladyslav/onix-chat-app
    ```

2. Navigate to the project directory:

    ```bash
    cd onix-chat-app
    ```

3. Make sure you have Docker installed on your machine. Then, run the following command to start the database service:

    ```bash
    docker-compose up postgres minio
    ```

4. Once the database service is running, you can proceed to install dependencies and start the application:

   ```bash
   npm install
   ```

5. Copy env:

   ```bash
   $ make copy-env
   ```
   
6. Start the application:

   ```bash
   # development
   $ npm run start
   
   # watch mode
   $ npm run start:dev
   
   # production mode
   $ npm run start:prod
   ```

7. Access the application in your browser at `http://localhost:3000`.


### Starting the Application with PM2

To start the application using PM2, run: example start with scale on 2 core:
```bash
pm2 start ./dist/main.js -i 2 --no-daemon
```

### Starting the Application with Docker

* [Install Docker](https://docs.docker.com/get-docker/)
* [Install docker-compose](https://docs.docker.com/compose/install/)

To run your app in docker containers choose "Yes" when the generator asks you about docker.

#### Change in env url

#### Now, lift up your app in docker
```bash
  docker-compose up
```

## Set up environment
In root folder you can find `.env`. You can use this config or change it for your purposes.

## Swagger
Swagger documentation will be available on route:
```bash
http://localhost:3000/docs
```
