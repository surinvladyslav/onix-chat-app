<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Onix Chat App

Welcome to Onix Chat App, a test project developed for Onix Company. This application is a simple chat application built using Nest.js, Socket.io, PM2, Prisma ORM/ODM, Docker, Docker-compose, Min.io, Swagger, and EJS.

## Stack

1. **Nest.js**: Nest is a framework for building efficient, reliable, and scalable server-side applications.
2. **Socket.io**: Socket.io enables real-time, bidirectional, and event-based communication between web clients and servers.
3. **PM2**: PM2 is a production process manager for Node.js applications with a built-in load balancer.
4. **Prisma ORM/ODM**: Prisma is a modern database toolkit that makes it easy to work with databases in Node.js.
5. **Docker**: Docker is a platform for developing, shipping, and running applications in containers.
6. **Docker-compose**: Docker Compose is a tool for defining and running multi-container Docker applications.
7. **Min.io**: Min.io is a high-performance object storage server compatible with Amazon S3 APIs.
8. **Swagger**: Swagger is an open-source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful web services.
9. **EJS**: EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.

## Setup Instructions

To run the Onix Chat App locally, follow these steps:


1. Clone this repository to your local machine:

    ```
    git clone https://github.com/surinvladyslav/onix-chat-app
    ```

2. Navigate to the project directory:

    ```
    cd onix-chat-app
    ```

3. Install dependencies:

   ```bash
   $ npm install
   ```

4. Copy env:

   ```bash
   $ make copy-env
   ```
   
4. Start the application:

   ```bash
   # development
   $ npm run start
   
   # watch mode
   $ npm run start:dev
   
   # production mode
   $ npm run start:prod
   ```

5. Access the application in your browser at `http://localhost:3000`.

## Docker Deployment

To deploy the Onix Chat App using Docker, follow these steps:

1. Make sure you have Docker installed on your machine.

2. Navigate to the project directory.

3. Run the following command to build the Docker image:

    ```bash
    docker-compose up -d --build
    ```

4. Access the application in your browser at `http://localhost:3000`.

## Usage

Once the application is up and running, you can access the chat interface in your browser. Users can join different chat rooms, send messages, and interact with other users in real-time.

## Additional Information

For more detailed information about the APIs and endpoints provided by the application, you can check the Swagger documentation available at `http://localhost:3000/api`.

## Contributing

Contributions to the Onix Chat App project are welcome. If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

### Starting the Application with PM2

To start the application using PM2, run:

```bash
npm run pm2-start
```

### Viewing PM2 Process List

To view the list of processes managed by PM2, run:

```bash
npm run pm2-list
```

### Monitoring Application Logs with PM2

To monitor application logs using PM2, run:

```bash
npm run pm2-logs

npm run pm2-monit
```

### Stopping the Application Managed by PM2

To stop the application managed by PM2, run:

```bash
npm run pm2-stop
```

### Restarting the Application Managed by PM2

To restart the application managed by PM2, run:

```bash
npm run pm2-restart
```

### Deleting the Application from PM2

To delete the application from PM2, run:

```bash
npm run pm2-delete
```

### Setting Up PM2 Startup Script

To set up PM2 to start on system boot, run:

```bash
npm run pm2-startup
```

Make sure to replace `"your-app-name"` with the name you've assigned to your application in the PM2 commands.
