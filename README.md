# Home Library Service

Home Library is a RESTful API built with NestJS, PostgreSQL, and Prisma ORM. It provides functionality to manage a collection of albums, artists, and tracks.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker and Docker Compose - Download & Install

## Downloading

```
git clone https://github.com/IrinaPeshko/nodejs2024Q1-service.git
```

## Set up environment variables

1. **Create a `.env` file in the project root** and fill it with the necessary environment variables:

    ```env
    PORT=4000
    DATABASE_URL="postgresql://admin:root@host.docker.internal:5432/mydb?schema=public"
    POSTGRES_USER="admin"
    POSTGRES_PASSWORD="root"
    POSTGRES_PORT=5432
    ```

    These variables are used to configure various aspects of the application and database.

2. **Configure Database Connection**

    The `DATABASE_URL` in the `.env` file should point to your PostgreSQL instance. Make sure that the PostgreSQL service is running and accessible at the specified URL.

### Running the Application

1. **Install dependencies**

    Run the following command to install the required Node.js dependencies:

    ```sh
    npm install
    ```

2. **Start the Application**

    Use Docker Compose to start the application:

    ```sh
    docker-compose up
    ```

    This command builds the Docker images and starts the services defined in `docker-compose.yml`.

3. **Accessing the Application**

    Once the application is running, you can access it at `http://localhost:4000`. Adjust the port if you have changed the `PORT` environment variable in your `.env` file.

### Docker Security Scanning

Use the following npm scripts to scan Docker images for vulnerabilities:

- Scan the application image:
  
  ```sh
  npm run docker-scan:app
'''

  - Scan the database image:
  
  ```sh
  npm run docker-scan:db
  ```

### Stopping the Application

- To stop the application and remove containers, networks, and volumes created by `docker-compose up`, run:

    ```sh
    docker-compose down
    ```

### Important Notes

- Ensure that the port numbers specified in the `.env` file and `docker-compose.yml` do not conflict with other services on your system.
- Modify environment variables in `.env` as needed for your specific development or deployment environment.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```



### Running Tests in a Separate Terminal
Tests are an essential part of this application. To run tests while the application is running, open a new terminal window and execute the test commands. This allows you to run tests without interrupting the application's runtime.

### OpenAPI Documentation
The application is documented using OpenAPI. You can access the documentation by navigating to `http://localhost:4000/doc/` in your web browser after starting the application.
